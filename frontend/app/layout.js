import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata = {
  title: 'Fresh Seafood Delivery in Sri Lanka | RSN Sea Food',
  description:
    'Order fresh fish, crab, prawns, squid and other seafood with convenient islandwide delivery across Sri Lanka. Based in Kalpitiya, Puttalam District.',
  openGraph: {
    title: 'Fresh Seafood Delivery in Sri Lanka | RSN Sea Food',
    description:
      'Order fresh fish, crab, prawns, squid and other seafood with convenient islandwide delivery across Sri Lanka.',
    type: 'website',
    locale: 'en_LK',
  },
  metadataBase: new URL('https://rsnseafood.example.com'),
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 font-sans text-gray-800 antialiased">
        <LanguageProvider>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <FloatingButtons />
        </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
