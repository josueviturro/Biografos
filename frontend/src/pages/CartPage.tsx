// --- Página carrito: lista de items, resumen y botón checkout ---

import Button from '../components/Button';
import QuantitySelector from '../components/QuantitySelector';
import { formatPrice } from '../utils/format';
import type { CartItem, PageView } from '../types';
import styles from './CartPage.module.css';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onNavigate: (page: PageView) => void;
}

export default function CartPage({ cartItems, onUpdateQuantity, onRemoveItem, onNavigate }: CartPageProps) {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Estado vacío
  if (cartItems.length === 0) {
    return (
      <main className={styles.empty}>
        <h2 className={styles.emptyTitle}>Tu carrito está vacío</h2>
        <p className={styles.emptyText}>Descubrí nuestras colecciones y encontrá la pieza perfecta.</p>
        <Button variant="secondary" onClick={() => onNavigate('catalog')} className={styles.emptyBtn}>
          Ir al Catálogo
        </Button>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.pageTitle}>Tu Carrito</h1>

      <div className={styles.layout}>

        {/* ── Lista de productos ── */}
        <div className={styles.itemsList}>
          {cartItems.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.itemCategory}>{item.category}</p>
                <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
              </div>
              <div className={styles.itemActions}>
                <QuantitySelector
                  quantity={item.quantity}
                  onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  onDecrease={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                />
                <button className={styles.removeBtn} onClick={() => onRemoveItem(item.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Resumen de compra ── */}
        <aside className={styles.summary}>
          <h3 className={styles.summaryTitle}>Resumen de Compra</h3>

          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Envío</span>
              <span>Gratis</span>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.totalRow}>
            <span>Total</span>
            <span className={styles.totalAmount}>{formatPrice(subtotal)}</span>
          </div>

          <Button fullWidth onClick={() => onNavigate('checkout')}>
            Iniciar Compra
          </Button>

          <button className={styles.continueBtn} onClick={() => onNavigate('catalog')}>
            Seguir comprando
          </button>
        </aside>

      </div>
    </main>
  );
}
