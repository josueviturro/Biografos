// --- Panel de administración: gestión de productos (CRUD) ---

import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Package, Tag, LayoutGrid } from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORIES } from '../data/products';
import { formatPrice } from '../utils/format';
import type { Product } from '../types';
import styles from './AdminPage.module.css';

const EMPTY_FORM: Omit<Product, 'id'> = {
  name: '',
  price: 0,
  stock: 0,
  description: '',
  image: '',
  category: 'Dormitorio',
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // ── Estadísticas rápidas ──
  const totalProducts = products.length;
  const totalCategories = new Set(products.map((p) => p.category)).size;
  const lowStock = products.filter((p) => p.stock <= 3).length;

  // ── Abrir modal para nuevo producto ──
  const handleNew = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  // ── Abrir modal para editar ──
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({ name: product.name, price: product.price, stock: product.stock, description: product.description, image: product.image, category: product.category });
    setModalOpen(true);
  };

  // ── Guardar (nuevo o edición) ──
  const handleSave = () => {
    if (!form.name || !form.price) return;
    if (editingProduct) {
      setProducts((prev) => prev.map((p) => p.id === editingProduct.id ? { ...editingProduct, ...form } : p));
    } else {
      const newId = Math.max(...products.map((p) => p.id)) + 1;
      setProducts((prev) => [...prev, { id: newId, ...form }]);
    }
    setModalOpen(false);
  };

  // ── Eliminar producto ──
  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className={styles.layout}>

      {/* ── Top bar mobile (reemplaza sidebar en pantallas chicas) ── */}
      <div className={styles.mobileTopBar}>
        <div className={styles.mobileTopBarBrand}>
          <span className={styles.mobileTopBarTitle}>BIOGRAFO</span>
          <span className={styles.mobileTopBarSub}>Panel Admin</span>
        </div>
        <a href="/#/" className={styles.mobileTopBarLink}>← Ver tienda</a>
      </div>

      {/* ── Sidebar (tablet y desktop) ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.sidebarTitle}>BIOGRAFO</span>
          <span className={styles.sidebarSub}>Panel Admin</span>
        </div>
        <nav className={styles.sidebarNav}>
          <a href="/#/" className={styles.sidebarLink}>← Ver tienda</a>
          <span className={styles.sidebarLinkActive}>Productos</span>
        </nav>
      </aside>

      {/* ── Contenido principal ── */}
      <main className={styles.main}>

        {/* Header */}
        <div className={styles.topBar}>
          <h1 className={styles.pageTitle}>Productos</h1>
          <button className={styles.newBtn} onClick={handleNew}>
            <Plus size={18} /> Nuevo Producto
          </button>
        </div>

        {/* ── Stats ── */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <Package size={22} className={styles.statIcon} />
            <div>
              <p className={styles.statValue}>{totalProducts}</p>
              <p className={styles.statLabel}>Productos</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <LayoutGrid size={22} className={styles.statIcon} />
            <div>
              <p className={styles.statValue}>{totalCategories}</p>
              <p className={styles.statLabel}>Categorías</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <Tag size={22} className={styles.statIcon} />
            <div>
              <p className={`${styles.statValue} ${lowStock > 0 ? styles.statAlert : ''}`}>{lowStock}</p>
              <p className={styles.statLabel}>Stock bajo</p>
            </div>
          </div>
        </div>

        {/* ── Tabla de productos ── */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className={styles.tdThumb}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className={styles.thumbnail}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className={styles.thumbnailEmpty} />
                    )}
                  </td>
                  <td className={styles.tdName}>{product.name}</td>
                  <td><span className={styles.categoryBadge}>{product.category}</span></td>
                  <td className={styles.tdPrice}>{formatPrice(product.price)}</td>
                  <td>
                    <span className={`${styles.stockBadge} ${product.stock === 0 ? styles.stockNone : product.stock <= 3 ? styles.stockLow : styles.stockOk}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className={styles.tdActions}>
                    <button className={styles.editBtn} onClick={() => handleEdit(product)}>
                      <Pencil size={15} />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => setDeleteConfirm(product.id)}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>

      {/* ── Modal Agregar / Editar ── */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button className={styles.modalClose} onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>

            <div className={styles.modalBody}>
              <label className={styles.fieldLabel}>Nombre</label>
              <input className={styles.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre del producto" />

              <div className={styles.inputRow}>
                <div>
                  <label className={styles.fieldLabel}>Precio ($)</label>
                  <input className={styles.input} type="number" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="0" />
                </div>
                <div>
                  <label className={styles.fieldLabel}>Stock</label>
                  <input className={styles.input} type="number" value={form.stock || ''} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} placeholder="0" />
                </div>
              </div>

              <label className={styles.fieldLabel}>Categoría</label>
              <select className={styles.input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.filter((c) => c !== 'Todos').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <label className={styles.fieldLabel}>Descripción</label>
              <textarea className={`${styles.input} ${styles.textarea}`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción del producto..." rows={3} />

              <label className={styles.fieldLabel}>URL de imagen</label>
              <input className={styles.input} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setModalOpen(false)}>Cancelar</button>
              <button className={styles.saveBtn} onClick={handleSave}>
                {editingProduct ? 'Guardar cambios' : 'Crear producto'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal confirmar eliminación ── */}
      {deleteConfirm !== null && (
        <div className={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.modalConfirm} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.confirmTitle}>¿Eliminar producto?</h3>
            <p className={styles.confirmText}>Esta acción no se puede deshacer.</p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button className={styles.deleteConfirmBtn} onClick={() => handleDelete(deleteConfirm)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
