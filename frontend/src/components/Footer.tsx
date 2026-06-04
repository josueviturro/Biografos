// --- Footer con logo, links rápidos y contacto ---

import Logo from './Logo';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>

          {/* Columna 1: Marca */}
          <div className={styles.brand}>
            <div className={styles.brandRow}>
              <Logo className={styles.logoImg} />
              <span className={styles.brandName}>BIOGRAFO</span>
            </div>
            <p className={styles.brandDesc}>
              Redefiniendo el lujo en el mobiliario de pino contemporáneo.
              Diseño atemporal, materiales nobles y artesanía excepcional.
            </p>
          </div>

          {/* Columna 2: Contacto */}
          <div>
            <h4 className={styles.colTitle}>Contacto</h4>
            <p className={styles.contactText}> Salta 231 San Jose -Temperley, Provincia de Buenos Aires</p>
            <p className={styles.contactText}>info@biografo.com</p>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className={styles.copyright}>
        © {new Date().getFullYear()} BIOGRAFO Muebles. Todos los derechos reservados.
      </div>
    </footer>
  );
}
