// --- Página checkout: datos de envío + resumen + pago con MercadoPago ---

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import styles from './CheckoutPage.module.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const total = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);

  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Llama a la Netlify Function que crea la preferencia en MercadoPago
  const handlePagar = async () => {
    setPaying(true);
    setError(null);
    try {
      const res = await fetch('/.netlify/functions/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            nombre: item.nombre,
            precio: item.precio,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // Redirige a la página de pago de MercadoPago
      window.location.href = data.init_point;
    } catch (e) {
      setError('No se pudo iniciar el pago. Intentá de nuevo.');
      console.error(e);
    } finally {
      setPaying(false);
    }
  };

  return (
    <main className={styles.main}>

      <button className={styles.backBtn} onClick={() => navigate('/carrito')}>
        <ArrowLeft size={18} /> Volver al carrito
      </button>

      <h1 className={styles.pageTitle}>Finalizar Compra</h1>

      <div className={styles.layout}>

        {/* ── Formulario de envío ── */}
        <div className={styles.form}>
          <section className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>1. Datos de Contacto y Envío</h3>
            <div className={styles.inputGrid}>
              <input type="text" placeholder="Nombre" className={styles.input} />
              <input type="text" placeholder="Apellido" className={styles.input} />
            </div>
            <input type="tel" placeholder="Teléfono" className={styles.input} />
            <input type="email" placeholder="Email" className={styles.input} />
            <input type="text" placeholder="Dirección de envío" className={styles.input} />
          </section>

          <section className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>2. Método de Pago</h3>
            <p className={styles.disabledText}>Al clickear el botón serás redirigido a MercadoPago.</p>
          </section>
        </div>

        {/* ── Resumen del pedido ── */}
        <aside className={styles.summary}>
          <h3 className={styles.summaryTitle}>Resumen del Pedido</h3>
          <ul className={styles.itemsList}>
            {cart.map((item) => (
              <li key={item.id} className={styles.summaryItem}>
                <span className={styles.summaryItemName}>{item.quantity}× {item.nombre}</span>
                <span>{formatPrice(item.precio * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className={styles.divider} />
          <div className={styles.totalRow}>
            <span>Total a Pagar</span>
            <span className={styles.totalAmount}>{formatPrice(total)}</span>
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <Button variant="accent" fullWidth className={styles.mpBtn} onClick={handlePagar} disabled={paying}>
            <CreditCard size={20} /> {paying ? 'Procesando...' : 'Pagar con MercadoPago'}
          </Button>

          <p className={styles.secureText}>
            <LockIcon /> Procesado de forma segura
          </p>
        </aside>

      </div>
    </main>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
