// --- Sección Ventas: órdenes desde Supabase ---

import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { getOrdenes, updateOrdenEstado, deleteOrden, type Orden } from '../../services/ordenes';
import styles from './AdminVentas.module.css';

const ESTADOS: Record<string, { label: string; color: string }> = {
  pagado:     { label: 'Pagado',     color: '#4CAF50' },
  fabricando: { label: 'Fabricando', color: '#FFA726' },
  enviado:    { label: 'Enviado',    color: '#7E57C2' },
  entregado:  { label: 'Entregado',  color: '#26A69A' },
  cancelado:  { label: 'Cancelado',  color: '#EF5350' },
};

const formatPrice = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(n);

const resumenItems = (orden: Orden) =>
  orden.items_orden.map(i => `${i.producto_nombre} x${i.cantidad}`).join(', ');

export default function AdminVentas() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<{ id: string; nuevoEstado: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    getOrdenes()
      .then(data => setOrdenes(data.filter(o => o.estado !== 'pendiente')))
      .finally(() => setLoading(false));
  }, []);

  const handleEstadoChange = (id: string, nuevoEstado: string) => {
    setConfirm({ id, nuevoEstado });
  };

  const confirmarCambio = async () => {
    if (!confirm) return;
    await updateOrdenEstado(confirm.id, confirm.nuevoEstado);
    setOrdenes(prev => prev.map(o => o.id === confirm.id ? { ...o, estado: confirm.nuevoEstado } : o));
    setConfirm(null);
  };

  const handleDelete = async (id: string) => {
    await deleteOrden(id);
    setOrdenes(prev => prev.filter(o => o.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <>
      <div className={styles.topBar}>
        <h1 className={styles.pageTitle}>Ventas</h1>
        <span className={styles.badge}>{ordenes.length} órdenes</span>
      </div>

      <div className={styles.tableWrapper}>
        {loading ? (
          <p style={{ padding: '2rem', color: 'var(--color-gray)', textAlign: 'center' }}>Cargando...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Productos</th>
                <th>Dirección</th>
                <th>Celular</th>
                <th>Email</th>
                <th>Total</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map(o => (
                <tr key={o.id}>
                  <td className={styles.tdId}>{o.numero}</td>
                  <td className={styles.tdFecha}>{new Date(o.created_at).toLocaleDateString('es-AR')}</td>
                  <td className={styles.tdCliente}>{o.cliente_nombre} {o.cliente_apellido}</td>
                  <td className={styles.tdProducto}>{resumenItems(o)}</td>
                  <td className={styles.tdDireccion}>{o.cliente_direccion}</td>
                  <td className={styles.tdCelular}>
                    <a href={`https://wa.me/${o.cliente_celular.replace(/\D/g, '')}`}
                      target="_blank" rel="noreferrer" className={styles.waLink}>
                      {o.cliente_celular}
                    </a>
                  </td>
                  <td className={styles.tdEmail}>{o.cliente_email}</td>
                  <td className={styles.tdTotal}>{formatPrice(o.total)}</td>
                  <td>
                    <select
                      className={styles.estadoSelect}
                      value={o.estado}
                      onChange={e => handleEstadoChange(o.id, e.target.value)}
                      style={{ color: ESTADOS[o.estado]?.color, borderColor: ESTADOS[o.estado]?.color }}
                    >
                      {Object.entries(ESTADOS).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className={styles.deleteBtn} onClick={() => setDeleteConfirm(o.id)}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {ordenes.length === 0 && (
                <tr><td colSpan={10} className={styles.empty}>No hay órdenes todavía.</td></tr>
              )}
            </tbody>
          </table>
        )}
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

      {/* Modal eliminar */}
      {deleteConfirm && (
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
