// --- Raíz de la app: rutas con React Router + estado global del carrito ---

import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import PagoExitosoPage from './pages/PagoExitosoPage';
import PagoFallidoPage from './pages/PagoFallidoPage';
import PagoPendientePage from './pages/PagoPendientePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />

          <Route element={<ShopLayout />}>
            <Route path="/"               element={<HomePage />} />
            <Route path="/catalogo"       element={<CatalogPage />} />
            <Route path="/producto/:id"   element={<ProductDetailPage />} />
            <Route path="/carrito"        element={<CartPage />} />
            <Route path="/checkout"       element={<CheckoutPage />} />
            <Route path="/pago-exitoso"   element={<PagoExitosoPage />} />
            <Route path="/pago-fallido"   element={<PagoFallidoPage />} />
            <Route path="/pago-pendiente" element={<PagoPendientePage />} />
            <Route path="*"               element={<NotFoundPage />} />
          </Route>
        </Routes>
      </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

function ShopLayout() {
  return (
    <>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 5rem - 200px)' }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
