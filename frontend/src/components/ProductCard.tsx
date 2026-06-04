// --- Card de producto: categoría, nombre, precio, botón agregar ---

import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import { formatPrice } from '../utils/format';
import Button from './Button';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <article className={styles.card}>
      <div className={styles.body}>
        <div>
          <p className={styles.category}>{product.category}</p>
          <h3 className={styles.name} onClick={() => navigate(`/producto/${product.id}`)}>
            {product.name}
          </h3>
          <p className={styles.price}>{formatPrice(product.price)}</p>
          {product.stock <= 3 && product.stock > 0 && (
            <p className={styles.lowStock}>¡Últimas {product.stock} unidades!</p>
          )}
          {product.stock === 0 && (
            <p className={styles.noStock}>Sin stock</p>
          )}
        </div>
        <Button
          variant="secondary"
          fullWidth
          onClick={() => addToCart(product)}
          className={styles.addBtn}
          disabled={product.stock === 0}
        >
          Agregar al Carrito
        </Button>
      </div>
    </article>
  );
}
