// --- Card de producto: imagen, categoría, nombre, precio, botón agregar ---

import type { Product } from '../types';
import { formatPrice } from '../utils/format';
import Button from './Button';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetail: (id: number) => void;
}

export default function ProductCard({ product, onAddToCart, onViewDetail }: ProductCardProps) {
  return (
    <article className={styles.card}>
      {/* Info del producto */}
      <div className={styles.body}>
        <div>
          <p className={styles.category}>{product.category}</p>
          <h3
            className={styles.name}
            onClick={() => onViewDetail(product.id)}
          >
            {product.name}
          </h3>
          <p className={styles.price}>{formatPrice(product.price)}</p>
        </div>
        <Button
          variant="secondary"
          fullWidth
          onClick={() => onAddToCart(product)}
          className={styles.addBtn}
        >
          Agregar al Carrito
        </Button>
      </div>
    </article>
  );
}
