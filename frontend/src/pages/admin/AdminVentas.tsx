// --- Sección Ventas: órdenes recibidas ---

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import styles from './AdminVentas.module.css';

interface Venta {
  id: number;
  fecha: string;
  cliente: string;
  producto: string;
  direccion: string;
  celular: string;
  email: string;
  total: number;
  estado: string;
}

const MOCK_VENTAS: Venta[] = [
  { id: 1, fecha: '2026-06-01', cliente: 'Juan Pérez',   producto: 'Cama de Pino x1', direccion: 'Av. Corrientes 1234, CABA',      celular: '5491112345678', email: 'juan@mail.com',   total: 350000, estado: 'pendiente'  },
  { id: 2, fecha: '2026-06-02', cliente: 'María García', producto: 'Silla Tejida x4', direccion: 'San Martín 456, Temperley',      celular: '5491198765432', email: 'maria@mail.com',  total: 260000, estado: 'preparando' },
  { id: 3, fecha: '2026-06-03', cliente: 'Carlos López', producto: 'Mesa Rústica x1', direccion: 'Belgrano 789, Lomas de Zamora',  celular: '5491165432198', email: 'carlos@mail.com', total: 280000, estado: 'enviado'    },
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
  const [confirm, setConfirm] = useState<{ id: number; nuevoEstado: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const handleEstadoChange = (id: number, nuevoEstado: string) => {
    setConfirm({ id, nuevoEstado });
  };

  const confirmarCambio = () => {
    if (!confirm) return;
    setVentas(prev => prev.map(v => v.id === confirm.id ? { ...v, estado: confirm.nuevoEstado } : v));
    setConfirm(null);
  };

  const handleDelete = (id: number) => {
    setVentas(prev => prev.filter(v => v.id !== id));
    setDeleteConfirm(null);
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
              <th>Producto</th>
              <th>Dirección</th>
              <th>Celular</th>
              <th>Email</th>
              <th>Total</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ventas.map(v => (
              <tr key={v.id}>
                <td className={styles.tdId}>{v.id}</td>
                <td className={styles.tdFecha}>{v.fecha}</td>
                <td className={styles.tdCliente}>{v.cliente}</td>
                <td className={styles.tdProducto}>{v.producto}</td>
                <td className={styles.tdDireccion}>{v.direccion}</td>
                <td className={styles.tdCelular}>
                  <a
                    href={`https://wa.me/${v.celular}`}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.waLink}
                  >
                    +{v.celular}
                  </a>
                </td>
                <td className={styles.tdEmail}>{v.email}</td>
                <td className={styles.tdTotal}>{formatPrice(v.total)}</td>
                <td>
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
                <td>
                  <button className={styles.deleteBtn} onClick={() => setDeleteConfirm(v.id)}>
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {ventas.length === 0 && (
              <tr><td colSpan={10} className={styles.empty}>No hay órdenes todavía.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal cambiar estado */}
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

      {/* Modal eliminar orden */}
      {deleteConfirm !== null && (
        <div className={styles.overlay} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>¿Eliminar orden?</h3>
            <p className={styles.modalText}>Esta acción no se puede deshacer.</p>
            <div className={styles.modalActions}>
              <button className={styles.btnNo} onClick={() => setDeleteConfirm(null)}>No</button>
              <button className={styles.btnDelete} onClick={() => handleDelete(deleteConfirm)}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
