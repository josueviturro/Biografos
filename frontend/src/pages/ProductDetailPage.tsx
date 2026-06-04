// --- Página detalle de producto: descripción, selector cantidad, agregar al carrito ---

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import QuantitySelector from '../components/QuantitySelector';
import { MOCK_PRODUCTS } from '../data/products';
import { formatPrice } from '../utils/format';
import { useCart } from '../context/CartContext';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = MOCK_PRODUCTS.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <main className={styles.notFound}>
        <p>Producto no encontrado.</p>
        <button onClick={() => navigate('/catalogo')} className={styles.backBtn}>
          <ArrowLeft size={18} /> Volver al catálogo
        </button>
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/carrito');
  };

  return (
    <main className={styles.main}>

      {/* Botón volver */}
      <button className={styles.backBtn} onClick={() => navigate('/catalogo')}>
        <ArrowLeft size={18} /> Volver al Catálogo
      </button>

      <div className={styles.layout}>

        {/* ── Detalle del producto ── */}
        <div className={styles.info}>
          <p className={styles.category}>{product.category}</p>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.price}>{formatPrice(product.price)}</p>

          <div className={styles.divider} />

          <p className={styles.description}>{product.description}</p>

          {/* Stock */}
          <p className={styles.stockInfo}>
            {product.stock > 3
              ? `Stock disponible: ${product.stock} unidades`
              : product.stock > 0
              ? `¡Últimas ${product.stock} unidades!`
              : 'Sin stock'}
          </p>

          {/* Selector de cantidad */}
          <div className={styles.quantityRow}>
            <QuantitySelector
              quantity={quantity}
              onIncrease={() => setQuantity((q) => Math.min(q + 1, product.stock))}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
            />
          </div>

          <Button fullWidth onClick={handleAddToCart} disabled={product.stock === 0}>
            Agregar al Carrito — {formatPrice(product.price * quantity)}
          </Button>

          <ul className={styles.benefits}>
            <li>Envío gratuito en CABA y GBA.</li>
            <li>Garantía de 5 años en estructura.</li>
          </ul>
        </div>

      </div>
    </main>
  );
}
