// --- Página Home: Hero, Categorías destacadas, Más vendidos ---

import { ChevronRight } from 'lucide-react';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../data/products';
import type { PageView, Product } from '../types';
import styles from './HomePage.module.css';

const FEATURED_CATEGORIES = ['Dormitorio', 'Mesas', 'Almacenamiento'];

interface HomePageProps {
  onNavigate: (page: PageView) => void;
  onViewDetail: (id: number) => void;
  onAddToCart: (product: Product) => void;
}

export default function HomePage({ onNavigate, onViewDetail, onAddToCart }: HomePageProps) {
  const bestSellers = MOCK_PRODUCTS.slice(0, 3);

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
          <Button onClick={() => onNavigate('catalog')} className={styles.heroBtn}>
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
                onClick={() => onNavigate('catalog')}
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
            <button
              className={styles.viewAllBtn}
              onClick={() => onNavigate('catalog')}
            >
              Ver todo <ChevronRight size={16} />
            </button>
          </div>
          <div className={styles.productGrid}>
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onViewDetail={onViewDetail}
              />
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
