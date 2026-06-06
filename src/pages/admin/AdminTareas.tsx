// --- Sección Tareas: lista de pendientes guardada en localStorage ---

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import styles from './AdminTareas.module.css';

interface Tarea {
  id: string;
  texto: string;
  hecha: boolean;
  fecha: string;
}

const STORAGE_KEY = 'biografo_tareas';

export default function AdminTareas() {
  const [tareas, setTareas] = useState<Tarea[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch { return []; }
  });
  const [input, setInput] = useState('');

  // Guardar en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
  }, [tareas]);

  const agregar = () => {
    if (!input.trim()) return;
    const nueva: Tarea = {
      id: crypto.randomUUID(),
      texto: input.trim(),
      hecha: false,
      fecha: new Date().toLocaleDateString('es-AR'),
    };
    setTareas(prev => [nueva, ...prev]);
    setInput('');
  };

  const toggleHecha = (id: string) => {
    setTareas(prev => prev.map(t => t.id === id ? { ...t, hecha: !t.hecha } : t));
  };

  const eliminar = (id: string) => {
    setTareas(prev => prev.filter(t => t.id !== id));
  };

  const pendientes = tareas.filter(t => !t.hecha);
  const hechas = tareas.filter(t => t.hecha);

  return (
    <>
      <div className={styles.topBar}>
        <h1 className={styles.pageTitle}>Tareas</h1>
        <span className={styles.badge}>{pendientes.length} pendientes</span>
      </div>

      {/* Input nueva tarea */}
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && agregar()}
          placeholder="Nueva tarea... (Enter para agregar)"
        />
        <button className={styles.addBtn} onClick={agregar}>
          <Plus size={18} />
        </button>
      </div>

      {/* Tareas pendientes */}
      {pendientes.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Pendientes</h3>
          <ul className={styles.list}>
            {pendientes.map(t => (
              <li key={t.id} className={styles.item}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={false}
                  onChange={() => toggleHecha(t.id)}
                />
                <span className={styles.texto}>{t.texto}</span>
                <span className={styles.fecha}>{t.fecha}</span>
                <button className={styles.deleteBtn} onClick={() => eliminar(t.id)}>
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tareas hechas */}
      {hechas.length > 0 && (
        <div className={styles.section}>
          <h3 className={`${styles.sectionTitle} ${styles.sectionTitleDone}`}>Completadas</h3>
          <ul className={styles.list}>
            {hechas.map(t => (
              <li key={t.id} className={`${styles.item} ${styles.itemDone}`}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={true}
                  onChange={() => toggleHecha(t.id)}
                />
                <span className={`${styles.texto} ${styles.textoDone}`}>{t.texto}</span>
                <span className={styles.fecha}>{t.fecha}</span>
                <button className={styles.deleteBtn} onClick={() => eliminar(t.id)}>
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tareas.length === 0 && (
        <p className={styles.empty}>No hay tareas. ¡Todo al día!</p>
      )}
    </>
  );
}
