// --- Página Home: Hero, Categorías destacadas, Más vendidos desde Supabase ---

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    getProductos()
      .then((data) => setBestSellers(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (carouselRef.current?.offsetLeft ?? 0);
    scrollLeft.current = carouselRef.current?.scrollLeft ?? 0;
    if (carouselRef.current) carouselRef.current.style.cursor = 'grabbing';
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft ?? 0);
    const walk = (x - startX.current) * 1.5;
    if (carouselRef.current) carouselRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (carouselRef.current) carouselRef.current.style.cursor = 'grab';
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
        <div
          ref={carouselRef}
          className={styles.carousel}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
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
