"use client";

import { useEffect, useState } from "react";
import { api, resolveImageUrl } from "@/lib/api";
import { PRODUCTS as LOCAL_PRODUCTS } from "@/data/products";

function normalize(list) {
  return list.map((p) => ({
    ...p,
    image: resolveImageUrl(p.image),
    gallery: p.gallery?.map(resolveImageUrl),
  }));
}

// Tries the live API first (so admin-added products/photos show up); falls back
// to the bundled local catalog if the backend is unreachable.
export function useProducts(params = {}) {
  const [products, setProducts] = useState(normalize(LOCAL_PRODUCTS));
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("local");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    api
      .getProducts(params)
      .then((res) => {
        if (cancelled) return;
        setProducts(normalize(Array.isArray(res.products) ? res.products : []));
        setSource("api");
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(requestError.message || "Live product catalogue is unavailable.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return { products, loading, source, error };
}
