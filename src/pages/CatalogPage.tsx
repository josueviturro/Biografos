// --- Página Catálogo: sidebar de filtros + grilla de productos desde Supabase ---

import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProductos } from '../services/productos';
import type { Product } from '../types';
import styles from './CatalogPage.module.css';

const CATEGORIES = ['Todos', 'Dormitorio', 'Mesas', 'Sillas', 'Almacenamiento', 'Recibidor'];

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');

  useEffect(() => {
    getProductos()
      .then(setProducts)
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = categoriaFiltro === 'Todos'
    ? products
    : products.filter((p) => p.categorias?.nombre === categoriaFiltro);

  return (
    <main className={styles.main}>
      <div className={styles.layout}>

        {/* ── Sidebar de filtros ── */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSticky}>
            <h3 className={styles.filterTitle}>
              <Filter size={18} /> Filtros
            </h3>
            <div className={styles.divider} />
            <div className={styles.filterGroup}>
              <h4 className={styles.filterLabel}>Categoría</h4>
              <ul className={styles.filterList}>
                {CATEGORIES.map((cat) => (
                  <li
                    key={cat}
                    className={`${styles.filterItem} ${categoriaFiltro === cat ? styles.filterItemActive : ''}`}
                    onClick={() => setCategoriaFiltro(cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* ── Grilla de productos ── */}
        <div className={styles.content}>
          <h2 className={styles.pageTitle}>Catálogo Completo</h2>

          {loading && <p className={styles.message}>Cargando productos...</p>}
          {error && <p className={styles.messageError}>{error}</p>}
          {!loading && !error && filtered.length === 0 && (
            <p className={styles.message}>No hay productos en esta categoría.</p>
          )}

          <div className={styles.productGrid}>
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
