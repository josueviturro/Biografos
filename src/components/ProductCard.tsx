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

  const imagen = product.imagenes?.[0];
  const categoriaNombre = product.categorias?.nombre ?? '';

  return (
    <article className={styles.card}>
      {/* Imagen si existe */}
      {imagen && (
        <div className={styles.imageWrapper} onClick={() => navigate(`/producto/${product.id}`)}>
          <img
            src={imagen}
            alt={product.nombre}
            className={styles.image}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}

      <div className={styles.body}>
        <div>
          {categoriaNombre && <p className={styles.category}>{categoriaNombre}</p>}
          <h3 className={styles.name} onClick={() => navigate(`/producto/${product.id}`)}>
            {product.nombre}
          </h3>
          <div className={styles.priceRow}>
            <p className={styles.price}>{formatPrice(product.precio)}</p>
          </div>
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
