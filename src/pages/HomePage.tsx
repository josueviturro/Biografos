// --- Página Home: Hero, Categorías destacadas, Más vendidos desde Supabase ---

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import { getProductos } from '../services/productos';
import type { Product } from '../types';
import styles from './HomePage.module.css';

const FEATURED_CATEGORIES = ['Dormitorio', 'Mesas', 'Almacenamiento'];

export default function HomePage() {
  const navigate = useNavigate();
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  useEffect(() => {
    getProductos()
      .then((data) => setBestSellers(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <main>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2070&q=80"
            alt="Interior con muebles de pino"
            className={styles.heroImg}
          />
        </div>
        <div className={styles.heroContent}>
          <p className={styles.heroSubtitle}>Nueva Colección 2026</p>
          <h1 className={styles.heroTitle}>
            Elevando el Arte del <br /> Pino.
          </h1>
          <Button onClick={() => navigate('/catalogo')} className={styles.heroBtn}>
            Ver Colección <ChevronRight size={18} />
          </Button>
        </div>
      </section>

      {/* ── Categorías Destacadas ── */}
      <section className={styles.categories}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Categorías Destacadas</h2>
          <div className={styles.categoryGrid}>
            {FEATURED_CATEGORIES.map((cat) => (
              <div
                key={cat}
                className={styles.categoryCard}
                onClick={() => navigate('/catalogo')}
              >
                <h3 className={styles.categoryName}>{cat}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Más Vendidos ── */}
      <section className={styles.bestSellers}>
        <div className={styles.container}>
          <div className={styles.bestSellersHeader}>
            <h2 className={styles.sectionTitle}>Más Vendidos</h2>
            <button className={styles.viewAllBtn} onClick={() => navigate('/catalogo')}>
              Ver todo <ChevronRight size={16} />
            </button>
          </div>
          <div className={styles.productGrid}>
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
