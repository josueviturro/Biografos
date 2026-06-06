// --- Página carrito ---

import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import QuantitySelector from '../components/QuantitySelector';
import { formatPrice } from '../utils/format';
import styles from './CartPage.module.css';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateCartQuantity, removeFromCart } = useCart();
  const subtotal = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <main className={styles.empty}>
        <h2 className={styles.emptyTitle}>Tu carrito está vacío</h2>
        <p className={styles.emptyText}>Descubrí nuestras colecciones y encontrá la pieza perfecta.</p>
        <Button variant="secondary" onClick={() => navigate('/catalogo')} className={styles.emptyBtn}>
          Ir al Catálogo
        </Button>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.pageTitle}>Tu Carrito</h1>

      <div className={styles.layout}>
        <div className={styles.itemsList}>
          {cart.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <h3 className={styles.itemName}>{item.nombre}</h3>
                <p className={styles.itemCategory}>{item.categorias?.nombre}</p>
                <p className={styles.itemPrice}>{formatPrice(item.precio)}</p>
              </div>
              <div className={styles.itemActions}>
                <QuantitySelector
                  quantity={item.quantity}
                  onIncrease={() => updateCartQuantity(item.id, item.quantity + 1)}
                  onDecrease={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                />
                <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className={styles.summary}>
          <h3 className={styles.summaryTitle}>Resumen de Compra</h3>
          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className={styles.summaryRow}><span>Envío</span><span>Gratis</span></div>
          </div>
          <div className={styles.divider} />
          <div className={styles.totalRow}>
            <span>Total</span>
            <span className={styles.totalAmount}>{formatPrice(subtotal)}</span>
          </div>
          <Button fullWidth onClick={() => navigate('/checkout')}>Iniciar Compra</Button>
          <button className={styles.continueBtn} onClick={() => navigate('/catalogo')}>Seguir comprando</button>
        </aside>
      </div>
    </main>
  );
}
