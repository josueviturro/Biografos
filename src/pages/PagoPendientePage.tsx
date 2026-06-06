// --- Página de pago pendiente ---

import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import styles from './PagoResultadoPage.module.css';

export default function PagoPendientePage() {
  const navigate = useNavigate();

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <Clock size={56} className={styles.iconPending} />
        <h1 className={styles.title}>Pago en proceso</h1>
        <p className={styles.text}>Tu pago está siendo procesado. Te avisaremos por email cuando se confirme.</p>
        <button className={styles.btn} onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    </main>
  );
}
