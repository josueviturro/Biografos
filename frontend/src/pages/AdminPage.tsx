// --- Panel de administración: layout con sidebar y secciones ---

import { useState } from 'react';
import { Package, ShoppingBag, CheckSquare } from 'lucide-react';
import AdminProductos from './admin/AdminProductos';
import AdminVentas from './admin/AdminVentas';
import AdminTareas from './admin/AdminTareas';
import styles from './admin/AdminPage.module.css';

type Seccion = 'productos' | 'ventas' | 'tareas';

const NAV_ITEMS: { key: Seccion; label: string; icon: React.ReactNode }[] = [
  { key: 'productos', label: 'Productos', icon: <Package size={16} /> },
  { key: 'ventas',   label: 'Ventas',    icon: <ShoppingBag size={16} /> },
  { key: 'tareas',   label: 'Tareas',    icon: <CheckSquare size={16} /> },
];

export default function AdminPage() {
  const [seccion, setSeccion] = useState<Seccion>('productos');

  return (
    <div className={styles.layout}>

      {/* ── Top bar mobile ── */}
      <div className={styles.mobileTopBar}>
        <div className={styles.mobileTopBarBrand}>
          <span className={styles.mobileTopBarTitle}>BIOGRAFO</span>
          <span className={styles.mobileTopBarSub}>Panel Admin</span>
        </div>
        <div className={styles.mobileNavRow}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              className={seccion === item.key ? styles.mobileNavBtnActive : styles.mobileNavBtn}
              onClick={() => setSeccion(item.key)}
            >
              {item.icon}
            </button>
          ))}
          <a href="/#/" className={styles.mobileTopBarLink}>← Tienda</a>
        </div>
      </div>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.sidebarTitle}>BIOGRAFO</span>
          <span className={styles.sidebarSub}>Panel Admin</span>
        </div>
        <nav className={styles.sidebarNav}>
          <a href="/#/" className={styles.sidebarLink}>← Ver tienda</a>
          <div className={styles.sidebarDivider} />
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              className={seccion === item.key ? styles.sidebarLinkActive : styles.sidebarLinkBtn}
              onClick={() => setSeccion(item.key)}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Contenido de la sección activa ── */}
      <main className={styles.main}>
        {seccion === 'productos' && <AdminProductos />}
        {seccion === 'ventas'   && <AdminVentas />}
        {seccion === 'tareas'   && <AdminTareas />}
      </main>

    </div>
  );
}
