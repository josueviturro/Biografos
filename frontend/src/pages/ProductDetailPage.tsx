// --- Página detalle de producto: galería, descripción, selector cantidad, agregar al carrito ---

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import QuantitySelector from '../components/QuantitySelector';
import { MOCK_PRODUCTS } from '../data/products';
import { formatPrice } from '../utils/format';
import type { Product } from '../types';
import styles from './ProductDetailPage.module.css';

interface ProductDetailPageProps {
  productId: number | null;
  onAddToCart: (product: Product, quantity: number) => void;
  onBack: () => void;
}

export default function ProductDetailPage({ productId, onAddToCart, onBack }: ProductDetailPageProps) {
  const product = MOCK_PRODUCTS.find((p) => p.id === productId);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <main className={styles.notFound}>
        <p>Producto no encontrado.</p>
        <button onClick={onBack} className={styles.backBtn}>
          <ArrowLeft size={18} /> Volver
        </button>
      </main>
    );
  }

  return (
    <main className={styles.main}>

      {/* Botón volver */}
      <button className={styles.backBtn} onClick={onBack}>
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

          {/* Selector de cantidad */}
          <div className={styles.quantityRow}>
            <QuantitySelector
              quantity={quantity}
              onIncrease={() => setQuantity((q) => q + 1)}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
            />
          </div>

          {/* Botón agregar con total calculado */}
          <Button fullWidth onClick={() => onAddToCart(product, quantity)}>
            Agregar al Carrito — {formatPrice(product.price * quantity)}
          </Button>

          {/* Beneficios */}
          <ul className={styles.benefits}>
            <li>Envío gratuito en CABA y GBA.</li>
            <li>Garantía de 5 años en estructura.</li>
          </ul>
        </div>

      </div>
    </main>
  );
}
