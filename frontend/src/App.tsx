// --- Raíz de la app: rutas con React Router + estado global del carrito ---

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Panel admin — layout propio sin header/footer de tienda */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Tienda — layout con header y footer */}
          <Route path="*" element={<ShopLayout />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

function ShopLayout() {
  return (
    <>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 5rem - 200px)' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
