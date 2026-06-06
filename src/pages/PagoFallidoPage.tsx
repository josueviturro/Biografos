// --- Página de pago fallido ---

import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import styles from './PagoResultadoPage.module.css';

export default function PagoFallidoPage() {
  const navigate = useNavigate();

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <XCircle size={56} className={styles.iconError} />
        <h1 className={styles.title}>El pago no se completó</h1>
        <p className={styles.text}>Podés intentarlo de nuevo o elegir otro método de pago.</p>
        <button className={styles.btn} onClick={() => navigate('/carrito')}>Volver al carrito</button>
      </div>
    </main>
  );
}
