// --- Sección Ventas: órdenes recibidas (conectará a Supabase) ---

import { useState } from 'react';
import styles from './AdminVentas.module.css';

interface Venta {
  id: string;
  fecha: string;
  cliente: string;
  productos: string;
  total: number;
  estado: string;
}

const MOCK_VENTAS: Venta[] = [
  { id: '001', fecha: '2026-06-01', cliente: 'Juan Pérez',    productos: 'Cama de Pino x1',  total: 350000, estado: 'pendiente'  },
  { id: '002', fecha: '2026-06-02', cliente: 'María García',  productos: 'Silla Tejida x4',  total: 260000, estado: 'preparando' },
  { id: '003', fecha: '2026-06-03', cliente: 'Carlos López',  productos: 'Mesa Rústica x1',  total: 280000, estado: 'enviado'    },
];

const ESTADOS: Record<string, { label: string; color: string }> = {
  pendiente:  { label: 'Pendiente',  color: '#FFA726' },
  preparando: { label: 'Preparando', color: '#42A5F5' },
  enviado:    { label: 'Enviado',    color: '#7E57C2' },
  entregado:  { label: 'Entregado',  color: '#4CAF50' },
  cancelado:  { label: 'Cancelado',  color: '#EF5350' },
};

const formatPrice = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(n);

export default function AdminVentas() {
  const [ventas, setVentas] = useState<Venta[]>(MOCK_VENTAS);

  // Confirmación pendiente: { id de la venta, nuevo estado }
  const [confirm, setConfirm] = useState<{ id: string; nuevoEstado: string } | null>(null);

  const handleEstadoChange = (id: string, nuevoEstado: string) => {
    setConfirm({ id, nuevoEstado });
  };

  const confirmarCambio = () => {
    if (!confirm) return;
    setVentas(prev =>
      prev.map(v => v.id === confirm.id ? { ...v, estado: confirm.nuevoEstado } : v)
    );
    setConfirm(null);
  };

  return (
    <>
      <div className={styles.topBar}>
        <h1 className={styles.pageTitle}>Ventas</h1>
        <span className={styles.badge}>{ventas.length} órdenes</span>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map(v => (
              <tr key={v.id}>
                <td className={styles.tdId}>#{v.id}</td>
                <td className={styles.tdFecha}>{v.fecha}</td>
                <td className={styles.tdCliente}>{v.cliente}</td>
                <td className={styles.tdProductos}>{v.productos}</td>
                <td className={styles.tdTotal}>{formatPrice(v.total)}</td>
                <td>
                  {/* Dropdown para cambiar estado */}
                  <select
                    className={styles.estadoSelect}
                    value={v.estado}
                    onChange={e => handleEstadoChange(v.id, e.target.value)}
                    style={{ color: ESTADOS[v.estado]?.color, borderColor: ESTADOS[v.estado]?.color }}
                  >
                    {Object.entries(ESTADOS).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación */}
      {confirm && (
        <div className={styles.overlay} onClick={() => setConfirm(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>¿Cambiar estado?</h3>
            <p className={styles.modalText}>
              ¿Está seguro que desea cambiar el estado a{' '}
              <strong style={{ color: ESTADOS[confirm.nuevoEstado]?.color }}>
                {ESTADOS[confirm.nuevoEstado]?.label}
              </strong>?
            </p>
            <div className={styles.modalActions}>
              <button className={styles.btnNo} onClick={() => setConfirm(null)}>No</button>
              <button className={styles.btnSi} onClick={confirmarCambio}>Sí, cambiar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
