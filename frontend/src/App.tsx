// --- Componente raíz: maneja navegación SPA y estado global del carrito ---

import { useState, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import type { PageView, Product, CartItem } from './types';

export default function App() {
  // ── Navegación ──
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // ── Carrito ──
  const [cart, setCart] = useState<CartItem[]>([]);

  const cartCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  // Navegar y hacer scroll al tope
  const navigateTo = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const viewProductDetail = (id: number) => {
    setSelectedProductId(id);
    navigateTo('product-detail');
  };

  // Agregar al carrito: si ya existe suma cantidad, si no lo inserta
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  // ── Render de la página activa ──
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateTo} onViewDetail={viewProductDetail} onAddToCart={addToCart} />;
      case 'catalog':
        return <CatalogPage onViewDetail={viewProductDetail} onAddToCart={addToCart} />;
      case 'product-detail':
        return <ProductDetailPage productId={selectedProductId} onAddToCart={addToCart} onBack={() => navigateTo('catalog')} />;
      case 'cart':
        return <CartPage cartItems={cart} onUpdateQuantity={updateCartQuantity} onRemoveItem={removeFromCart} onNavigate={navigateTo} />;
      case 'checkout':
        return <CheckoutPage cartItems={cart} onBack={() => navigateTo('cart')} />;
      default:
        return <HomePage onNavigate={navigateTo} onViewDetail={viewProductDetail} onAddToCart={addToCart} />;
    }
  };

  return (
    <>
      <Header cartCount={cartCount} onNavigate={navigateTo} />
      <div style={{ minHeight: 'calc(100vh - 5rem - 200px)' }}>
        {renderPage()}
      </div>
      <Footer />
    </>
  );
}
