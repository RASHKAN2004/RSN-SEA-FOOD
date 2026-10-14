'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'rsn_seafood_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (_) {
      // ignore corrupted storage
    }
    setLoaded(true);
  }, []);

  // Persist on every change
  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  const addItem = useCallback((product, size, qty = 1) => {
    const unitPrice = Math.round(product.price * (size?.priceMultiplier || 1));
    const key = `${product.slug}__${size?.label || product.minimumQuantity}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        {
          key,
          slug: product.slug,
          name: product.name,
          localName: product.localName,
          image: product.image,
          sizeLabel: size?.label || product.minimumQuantity,
          unitPrice,
          qty,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQty = useCallback((key, qty) => {
    if (qty < 1) return removeItem(key);
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0),
    [items],
  );
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQty, clearCart, subtotal, count }),
    [items, addItem, removeItem, updateQty, clearCart, subtotal, count],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
