// --- Página checkout: datos de envío + resumen + botón MercadoPago ---

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import styles from './CheckoutPage.module.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

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

          <section className={`${styles.formSection} ${styles.formSectionDisabled}`}>
            <h3 className={styles.formSectionTitle}>2. Método de Pago</h3>
            <p className={styles.disabledText}>Completá los datos anteriores para continuar.</p>
          </section>
        </div>

        {/* ── Resumen del pedido ── */}
        <aside className={styles.summary}>
          <h3 className={styles.summaryTitle}>Resumen del Pedido</h3>
          <ul className={styles.itemsList}>
            {cart.map((item) => (
              <li key={item.id} className={styles.summaryItem}>
                <span className={styles.summaryItemName}>{item.quantity}× {item.name}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className={styles.divider} />
          <div className={styles.totalRow}>
            <span>Total a Pagar</span>
            <span className={styles.totalAmount}>{formatPrice(total)}</span>
          </div>
          <Button variant="accent" fullWidth className={styles.mpBtn}>
            <CreditCard size={20} /> Pagar con MercadoPago
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
