// --- Header sticky con logo, navegación desktop/mobile y carrito ---

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import Logo from './Logo';
import { useCart } from '../context/CartContext';
import styles from './Header.module.css';

export default function Header() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (path: string) => {
    navigate(path);
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
          <div className={styles.brand} onClick={() => handleNav('/')}>
            <Logo className={styles.logoImg} />
            <div className={styles.brandText}>
              <span className={styles.brandName}>BIOGRAFO</span>
              <span className={styles.brandSub}>Muebles de Pino</span>
            </div>
          </div>

          {/* Navegación desktop */}
          <nav className={styles.nav}>
            <button className={styles.navLink} onClick={() => handleNav('/')}>Home</button>
            <button className={styles.navLink} onClick={() => handleNav('/catalogo')}>Catálogo</button>
          </nav>

          {/* Ícono carrito + punto admin */}
          <div className={styles.cartGroup}>
            <button
              className={styles.cartBtn}
              onClick={() => handleNav('/carrito')}
              aria-label="Ver carrito"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className={styles.cartBadge}>{cartCount}</span>
              )}
            </button>
            <button
              className={styles.adminDot}
              onClick={() => handleNav('/adminpanel')}
              aria-label="Panel admin"
            />
          </div>

        </div>
      </div>

      {/* Menú mobile desplegable */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            <button className={styles.mobileNavLink} onClick={() => handleNav('/')}>Home</button>
            <button className={styles.mobileNavLink} onClick={() => handleNav('/catalogo')}>Catálogo</button>
          </nav>
        </div>
      )}
    </header>
  );
}
