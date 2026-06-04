// --- Header sticky con logo, navegación desktop/mobile y carrito ---

import { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import Logo from './Logo';
import type { PageView } from '../types';
import styles from './Header.module.css';

interface HeaderProps {
  cartCount: number;
  onNavigate: (page: PageView) => void;
}

export default function Header({ cartCount, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: PageView) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.inner}>

          {/* Botón menú mobile */}
          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo + nombre */}
          <div className={styles.brand} onClick={() => handleNav('home')}>
            <Logo className={styles.logoImg} />
            <div className={styles.brandText}>
              <span className={styles.brandName}>BIOGRAFO</span>
              <span className={styles.brandSub}>Muebles de Pino</span>
            </div>
          </div>

          {/* Navegación desktop */}
          <nav className={styles.nav}>
            <button className={styles.navLink} onClick={() => handleNav('home')}>Home</button>
            <button className={styles.navLink} onClick={() => handleNav('catalog')}>Catálogo</button>
          </nav>

          {/* Ícono carrito */}
          <button
            className={styles.cartBtn}
            onClick={() => onNavigate('cart')}
            aria-label="Ver carrito"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount}</span>
            )}
          </button>

        </div>
      </div>

      {/* Menú mobile desplegable */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            <button className={styles.mobileNavLink} onClick={() => handleNav('home')}>Home</button>
            <button className={styles.mobileNavLink} onClick={() => handleNav('catalog')}>Catálogo</button>
          </nav>
        </div>
      )}
    </header>
  );
}
