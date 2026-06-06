// --- Panel de administración: gestión de productos conectado a Supabase ---

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Package, Tag, LayoutGrid } from 'lucide-react';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../services/productos';
import { getCategorias } from '../services/categorias';
import { formatPrice } from '../utils/format';
import type { Product, Categoria } from '../types';
import styles from './AdminPage.module.css';

type ProductForm = {
  nombre: string;
  precio: number;
  precio_anterior: number;
  stock: number;
  descripcion: string;
  imagenes: string[];
  categoria_id: string;
  slug: string;
  activo: boolean;
};

const EMPTY_FORM: ProductForm = {
  nombre: '',
  precio: 0,
  precio_anterior: 0,
  stock: 0,
  descripcion: '',
  imagenes: [],
  categoria_id: '',
  slug: '',
  activo: true,
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // ── Cargar productos y categorías desde Supabase ──
  useEffect(() => {
    Promise.all([getProductos(), getCategorias()])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategorias(cats);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalProducts = products.length;
  const totalCategories = categorias.length;
  const lowStock = products.filter((p) => p.stock <= 3).length;

  const handleNew = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      nombre: product.nombre,
      precio: product.precio,
      precio_anterior: product.precio_anterior ?? 0,
      stock: product.stock,
      descripcion: product.descripcion,
      imagenes: product.imagenes ?? [],
      categoria_id: product.categoria_id,
      slug: product.slug,
      activo: product.activo,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.nombre || !form.precio) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        precio_anterior: form.precio_anterior || undefined,
        imagenes: form.imagenes.filter(Boolean),
      };

      if (editingProduct) {
        const updated = await updateProducto(editingProduct.id, payload);
        setProducts((prev) => prev.map((p) => p.id === editingProduct.id ? updated : p));
      } else {
        const created = await createProducto(payload);
        setProducts((prev) => [created, ...prev]);
      }
      setModalOpen(false);
    } catch (e) {
      alert('Error al guardar. Revisá la consola.');
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProducto(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert('Error al eliminar.');
      console.error(e);
    }
    setDeleteConfirm(null);
  };

  return (
    <div className={styles.layout}>

      {/* ── Top bar mobile ── */}
      <div className={styles.mobileTopBar}>
        <div className={styles.mobileTopBarBrand}>
          <span className={styles.mobileTopBarTitle}>BIOGRAFO</span>
          <span className={styles.mobileTopBarSub}>Panel Admin</span>
        </div>
        <a href="/#/" className={styles.mobileTopBarLink}>← Ver tienda</a>
      </div>

      {/* ── Sidebar ── */}
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

      {/* ── Contenido ── */}
      <main className={styles.main}>

        <div className={styles.topBar}>
          <h1 className={styles.pageTitle}>Productos</h1>
          <button className={styles.newBtn} onClick={handleNew}>
            <Plus size={18} /> Nuevo Producto
          </button>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <Package size={22} className={styles.statIcon} />
            <div><p className={styles.statValue}>{totalProducts}</p><p className={styles.statLabel}>Productos</p></div>
          </div>
          <div className={styles.statCard}>
            <LayoutGrid size={22} className={styles.statIcon} />
            <div><p className={styles.statValue}>{totalCategories}</p><p className={styles.statLabel}>Categorías</p></div>
          </div>
          <div className={styles.statCard}>
            <Tag size={22} className={styles.statIcon} />
            <div>
              <p className={`${styles.statValue} ${lowStock > 0 ? styles.statAlert : ''}`}>{lowStock}</p>
              <p className={styles.statLabel}>Stock bajo</p>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className={styles.tableWrapper}>
          {loading ? (
            <p style={{ padding: '2rem', color: 'var(--color-gray)', textAlign: 'center' }}>Cargando...</p>
          ) : (
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
                      {product.imagenes?.[0] ? (
                        <img src={product.imagenes[0]} alt={product.nombre} className={styles.thumbnail}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className={styles.thumbnailEmpty} />
                      )}
                    </td>
                    <td className={styles.tdName}>{product.nombre}</td>
                    <td><span className={styles.categoryBadge}>{product.categorias?.nombre ?? '—'}</span></td>
                    <td className={styles.tdPrice}>{formatPrice(product.precio)}</td>
                    <td>
                      <span className={`${styles.stockBadge} ${product.stock === 0 ? styles.stockNone : product.stock <= 3 ? styles.stockLow : styles.stockOk}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className={styles.tdActions}>
                      <button className={styles.editBtn} onClick={() => handleEdit(product)}><Pencil size={15} /></button>
                      <button className={styles.deleteBtn} onClick={() => setDeleteConfirm(product.id)}><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray)' }}>No hay productos cargados.</td></tr>
                )}
              </tbody>
            </table>
          )}
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
              <input className={styles.input} value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre del producto" />

              <div className={styles.inputRow}>
                <div>
                  <label className={styles.fieldLabel}>Precio ($)</label>
                  <input className={styles.input} type="number" value={form.precio || ''}
                    onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })} placeholder="0" />
                </div>
                <div>
                  <label className={styles.fieldLabel}>Precio anterior ($)</label>
                  <input className={styles.input} type="number" value={form.precio_anterior || ''}
                    onChange={(e) => setForm({ ...form, precio_anterior: Number(e.target.value) })} placeholder="0" />
                </div>
              </div>

              <div className={styles.inputRow}>
                <div>
                  <label className={styles.fieldLabel}>Stock</label>
                  <input className={styles.input} type="number" value={form.stock || ''}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} placeholder="0" />
                </div>
                <div>
                  <label className={styles.fieldLabel}>Slug</label>
                  <input className={styles.input} value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="nombre-del-producto" />
                </div>
              </div>

              <label className={styles.fieldLabel}>Categoría</label>
              <select className={styles.input} value={form.categoria_id}
                onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}>
                <option value="">Seleccionar...</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>

              <label className={styles.fieldLabel}>Descripción</label>
              <textarea className={`${styles.input} ${styles.textarea}`} value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Descripción del producto..." rows={3} />

              <label className={styles.fieldLabel}>URL de imagen</label>
              <input className={styles.input} value={form.imagenes[0] ?? ''}
                onChange={(e) => setForm({ ...form, imagenes: e.target.value ? [e.target.value] : [] })}
                placeholder="https://..." />

              <label className={styles.fieldLabel}>
                <input type="checkbox" checked={form.activo}
                  onChange={(e) => setForm({ ...form, activo: e.target.checked })} />
                {' '}Activo (visible en la tienda)
              </label>

            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setModalOpen(false)}>Cancelar</button>
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : editingProduct ? 'Guardar cambios' : 'Crear producto'}
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
