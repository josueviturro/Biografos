// --- Página de pago exitoso: actualiza la orden en Supabase ---

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { updateOrdenEstado } from '../services/ordenes';
import styles from './PagoResultadoPage.module.css';

export default function PagoExitosoPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    const externalRef = searchParams.get('external_reference');
    const collectionStatus = searchParams.get('collection_status') ?? searchParams.get('status');

    if (externalRef && collectionStatus === 'approved') {
      updateOrdenEstado(externalRef, 'pagado')
        .then(() => setStatus('ok'))
        .catch(() => setStatus('error'));
    } else {
      setStatus('ok');
    }
  }, [searchParams]);

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        {status === 'loading' && <p className={styles.msg}>Confirmando pago...</p>}

        {status === 'ok' && (
          <>
            <CheckCircle size={56} className={styles.iconOk} />
            <h1 className={styles.title}>¡Pago realizado!</h1>
            <p className={styles.text}>Tu orden fue registrada. Nos contactaremos a la brevedad para coordinar la entrega.</p>
            <button className={styles.btn} onClick={() => navigate('/')}>Volver al inicio</button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle size={56} className={styles.iconError} />
            <h1 className={styles.title}>Pago recibido</h1>
            <p className={styles.text}>Tu pago fue procesado pero hubo un problema al registrar la orden. Guardá el comprobante y escribinos.</p>
            <button className={styles.btn} onClick={() => navigate('/')}>Volver al inicio</button>
          </>
        )}
      </div>
    </main>
  );
}
