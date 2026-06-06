// --- Raíz de la app: rutas con React Router + estado global del carrito ---

import { HashRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import PagoExitosoPage from './pages/PagoExitosoPage';
import PagoFallidoPage from './pages/PagoFallidoPage';
import PagoPendientePage from './pages/PagoPendientePage';

export default function App() {
  return (
    <HashRouter>
      <CartProvider>
        <Routes>
          {/* Panel admin — layout propio sin header/footer */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Tienda — layout con header y footer */}
          <Route path="*" element={<ShopLayout />} />
        </Routes>
      </CartProvider>
    </HashRouter>
  );
}

function ShopLayout() {
  return (
    <>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 5rem - 200px)' }}>
        <Routes>
          <Route path="/"                element={<HomePage />} />
          <Route path="/catalogo"        element={<CatalogPage />} />
          <Route path="/producto/:id"    element={<ProductDetailPage />} />
          <Route path="/carrito"         element={<CartPage />} />
          <Route path="/checkout"        element={<CheckoutPage />} />
          <Route path="/pago-exitoso"    element={<PagoExitosoPage />} />
          <Route path="/pago-fallido"    element={<PagoFallidoPage />} />
          <Route path="/pago-pendiente"  element={<PagoPendientePage />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
