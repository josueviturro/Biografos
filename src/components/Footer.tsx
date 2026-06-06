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
            <p className={styles.contactText}>Salta 231 San Jose - Temperley, Buenos Aires</p>
            <p className={styles.contactText}>info@biografo.com</p>
            <a
              href="https://wa.me/5491132024997"
              target="_blank"
              rel="noreferrer"
              className={styles.whatsappLink}
            >
              Hacé click para contactar por WhatsApp
            </a>
          </div>

          {/* Columna 3: Mapa */}
          <div className={styles.mapCol}>
            <h4 className={styles.colTitle}>Cómo llegarnos</h4>
            <iframe
              className={styles.map}
              src="https://maps.google.com/maps?q=Salta+231+Temperley+Buenos+Aires+Argentina&output=embed&z=15"
              title="Ubicación BIOGRAFO"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>
      </div>

      {/* Copyright + crédito */}
      <div className={styles.copyright}>
        <span>© {new Date().getFullYear()} BIOGRAFO Muebles. Todos los derechos reservados.</span>
        <span className={styles.devCredit}>
          Desarrollado por{' '}
          <a href="https://josueviturro.com" target="_blank" rel="noreferrer" className={styles.devLink}>
            Josue Viturro
          </a>
        </span>
      </div>
    </footer>
  );
}
