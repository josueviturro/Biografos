// --- Página Catálogo: sidebar de filtros + grilla de productos ---

import { Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { MOCK_PRODUCTS, CATEGORIES } from '../data/products';
import styles from './CatalogPage.module.css';

export default function CatalogPage() {
  return (
    <main className={styles.main}>
      <div className={styles.layout}>

        {/* ── Sidebar de filtros (mock, sin lógica aún) ── */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSticky}>

            <h3 className={styles.filterTitle}>
              <Filter size={18} /> Filtros
            </h3>
            <div className={styles.divider} />

            {/* Filtro por categoría */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterLabel}>Categoría</h4>
              <ul className={styles.filterList}>
                {CATEGORIES.map((cat) => (
                  <li key={cat} className={styles.filterItem}>{cat}</li>
                ))}
              </ul>
            </div>

          </div>
        </aside>

        {/* ── Grilla de productos ── */}
        <div className={styles.content}>
          <h2 className={styles.pageTitle}>Catálogo Completo</h2>
          <div className={styles.productGrid}>
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
