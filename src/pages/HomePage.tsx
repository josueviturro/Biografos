// --- Página Home: Hero, Categorías destacadas, Más vendidos desde Supabase ---

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import { getProductos } from '../services/productos';
import type { Product } from '../types';
import styles from './HomePage.module.css';

const FEATURED_CATEGORIES = ['Dormitorio', 'Living', 'Comedor', 'Cocina', 'Baño', 'Oficina', 'Jardín', 'Quincho'];

const STEPS = [
  {
    number: '01',
    title: 'Elegí tu mueble',
    text: 'Explorá nuestro catálogo y encontrá el mueble que mejor se adapte a tu espacio y estilo.',
  },
  {
    number: '02',
    title: 'Agregalo al carrito',
    text: 'Seleccioná la cantidad y agregá el producto a tu carrito. Podés seguir comprando o proceder al pago.',
  },
  {
    number: '03',
    title: 'Completá tus datos',
    text: 'Ingresá tu información de contacto y dirección de entrega para coordinar el envío.',
  },
  {
    number: '04',
    title: 'Elegí cómo recibir tu pedido',
    text: 'Podés optar por el envío a domicilio con costo calculado según tu ubicación, o retirarlo directamente en nuestro local sin cargo.',
  },
  {
    number: '05',
    title: 'Pagá con MercadoPago',
    text: 'Abonás de forma segura con el medio de pago que prefieras — tarjeta, transferencia o efectivo. Una vez confirmado el pago, nos ponemos en contacto para coordinar la entrega.',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [current, setCurrent] = useState(4);
  const [cardWidth, setCardWidth] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProductos()
      .then((data) => setBestSellers(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  // Mide el viewport y calcula el ancho de cada tarjeta
  useEffect(() => {
    const update = () => {
      if (!viewportRef.current) return;
      const w = viewportRef.current.offsetWidth;
      const isMobile = window.innerWidth < 768;
      setCardWidth(isMobile ? w : w / 3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const isMobile = window.innerWidth < 768;
  const total = FEATURED_CATEGORIES.length;

  const prev = () => setCurrent((c: number) => Math.max(0, c - 1));
  const next = () => setCurrent((c: number) => Math.min(total - 1, c + 1));

  // Desplaza el track para centrar la tarjeta activa
  const trackOffset = isMobile
    ? -current * cardWidth
    : (1 - current) * cardWidth;

  const getCardState = (index: number) => {
    const diff = index - current;
    if (diff === 0) return 'active';
    if (!isMobile && Math.abs(diff) === 1) return 'adjacent';
    return 'hidden';
  };

  const stateClass = {
    active:   styles.cardActive,
    adjacent: styles.cardAdjacent,
    hidden:   styles.cardHidden,
  };

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
          <h2 className={styles.sectionTitle}>Elección por categorías</h2>
        </div>

        <div className={styles.carouselWrapper}>
          <button
            className={styles.arrowBtn}
            onClick={prev}
            disabled={current === 0}
            aria-label="Anterior"
          >
            <ChevronLeft size={22} />
          </button>

          <div ref={viewportRef} className={styles.carouselViewport}>
            <div
              className={styles.carouselTrack}
              style={{ transform: `translateX(${trackOffset}px)` }}
            >
              {FEATURED_CATEGORIES.map((cat, index) => (
                <div
                  key={cat}
                  className={`${styles.categoryCard} ${stateClass[getCardState(index)]}`}
                  style={{ width: cardWidth || undefined }}
                  onClick={() =>
                    getCardState(index) === 'active'
                      ? navigate('/catalogo')
                      : setCurrent(index)
                  }
                >
                  <h3 className={styles.categoryName}>{cat}</h3>
                </div>
              ))}
            </div>
          </div>

          <button
            className={styles.arrowBtn}
            onClick={next}
            disabled={current === total - 1}
            aria-label="Siguiente"
          >
            <ChevronRight size={22} />
          </button>
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

      {/* ── Guía de Compra ── */}
      <section className={styles.guide}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>¿Cómo Comprar?</h2>
          <div className={styles.stepsGrid}>
            {STEPS.map((step) => (
              <div key={step.number} className={styles.step}>
                <span className={styles.stepNumber}>{step.number}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
