import { useNavigate } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>Página no encontrada</h1>
        <p className={styles.text}>La dirección que buscás no existe o fue movida.</p>
        <button className={styles.btn} onClick={() => navigate('/')}>
          Volver al inicio
        </button>
      </div>
    </main>
  );
}
