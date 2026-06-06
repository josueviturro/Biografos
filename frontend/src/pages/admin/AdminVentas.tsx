// --- Sección Ventas: órdenes recibidas (conectará a Supabase) ---

import styles from './AdminVentas.module.css';

// Mock de órdenes — se reemplaza con Supabase cuando esté la tabla lista
const MOCK_VENTAS = [
  { id: '001', fecha: '2026-06-01', cliente: 'Juan Pérez', productos: 'Cama de Pino x1', total: 350000, estado: 'pendiente' },
  { id: '002', fecha: '2026-06-02', cliente: 'María García', productos: 'Silla Tejida x4', total: 260000, estado: 'preparando' },
  { id: '003', fecha: '2026-06-03', cliente: 'Carlos López', productos: 'Mesa Rústica x1', total: 280000, estado: 'enviado' },
];

const ESTADOS: Record<string, { label: string; color: string }> = {
  pendiente:  { label: 'Pendiente',   color: '#FFA726' },
  preparando: { label: 'Preparando',  color: '#42A5F5' },
  enviado:    { label: 'Enviado',     color: '#7E57C2' },
  entregado:  { label: 'Entregado',   color: '#4CAF50' },
  cancelado:  { label: 'Cancelado',   color: '#EF5350' },
};

const formatPrice = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(n);

export default function AdminVentas() {
  return (
    <>
      <div className={styles.topBar}>
        <h1 className={styles.pageTitle}>Ventas</h1>
        <span className={styles.badge}>{MOCK_VENTAS.length} órdenes</span>
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
            {MOCK_VENTAS.map(v => (
              <tr key={v.id}>
                <td className={styles.tdId}>#{v.id}</td>
                <td className={styles.tdFecha}>{v.fecha}</td>
                <td className={styles.tdCliente}>{v.cliente}</td>
                <td className={styles.tdProductos}>{v.productos}</td>
                <td className={styles.tdTotal}>{formatPrice(v.total)}</td>
                <td>
                  <span
                    className={styles.estadoBadge}
                    style={{ color: ESTADOS[v.estado]?.color, borderColor: ESTADOS[v.estado]?.color }}
                  >
                    {ESTADOS[v.estado]?.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
