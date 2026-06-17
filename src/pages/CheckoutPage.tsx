// --- Página checkout: datos de envío + resumen + pago con MercadoPago ---

import { useState, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, MapPin, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { createOrden } from '../services/ordenes';
import { calcularEnvio } from '../services/shipping';
import type { ShippingResult } from '../services/shipping';
import styles from './CheckoutPage.module.css';

const ShippingMap = lazy(() => import('../components/ShippingMap'));

interface FormData {
  nombre: string;
  apellido: string;
  celular: string;
  email: string;
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const subtotal = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);

  const [form, setForm] = useState<FormData>({ nombre: '', apellido: '', celular: '', email: '' });
  const [direccion, setDireccion] = useState('');
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [shipping, setShipping] = useState<ShippingResult | null>(null);
  const [calculando, setCalculando] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleAddressInput = (value: string) => {
    setDireccion(value);
    setSelectedCoords(null);
    setShipping(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 6) { setSuggestions([]); setShowDropdown(false); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5&countrycodes=ar`,
          { headers: { 'Accept-Language': 'es' } }
        );
        const data: Suggestion[] = await res.json();
        setSuggestions(data);
        setShowDropdown(data.length > 0);
      } catch {}
    }, 500);
  };

  const handleSelectSuggestion = (sug: Suggestion) => {
    setDireccion(sug.display_name.split(',').slice(0, 3).join(',').trim());
    setSelectedCoords([parseFloat(sug.lat), parseFloat(sug.lon)]);
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleCalcularEnvio = async () => {
    if (!direccion) { setShippingError('Ingresá tu dirección.'); return; }
    setCalculando(true);
    setShippingError(null);
    setShipping(null);
    try {
      const result = await calcularEnvio(direccion, selectedCoords ?? undefined);
      setShipping(result);
    } catch (e: any) {
      setShippingError(e.message ?? 'No se pudo calcular la distancia.');
    } finally {
      setCalculando(false);
    }
  };

  const costoEnvio = shipping && typeof shipping.costo === 'number' ? shipping.costo : 0;
  const total = subtotal + costoEnvio;
  const formCompleto = form.nombre && form.apellido && form.celular && form.email && direccion;

  const handlePagar = async () => {
    if (!formCompleto) { setError('Por favor completá todos los campos.'); return; }
    if (!shipping) { setError('Calculá el costo de envío antes de pagar.'); return; }
    if (shipping.costo === 'convenir') { setError('Tu distancia requiere coordinar el envío por WhatsApp.'); return; }
    if (cart.length === 0) return;

    setPaying(true);
    setError(null);
    try {
      const orden = await createOrden(
        {
          cliente_nombre: form.nombre,
          cliente_apellido: form.apellido,
          cliente_email: form.email,
          cliente_celular: form.celular,
          cliente_direccion: direccion,
          total,
        },
        cart
      );
      const res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orden.id,
          items: cart.map(item => ({ product_id: item.id, quantity: item.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.init_point;
    } catch (e) {
      setError('No se pudo iniciar el pago. Intentá de nuevo.');
      console.error(e);
    } finally {
      setPaying(false);
    }
  };

  return (
    <main className={styles.main}>

      <button className={styles.backBtn} onClick={() => navigate('/carrito')}>
        <ArrowLeft size={18} /> Volver al carrito
      </button>

      <h1 className={styles.pageTitle}>Finalizar Compra</h1>

      <div className={styles.layout}>

        {/* ── Formulario ── */}
        <div className={styles.form}>

          {/* Paso 1: Datos */}
          <section className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>1. Datos de Contacto</h3>
            <div className={styles.inputGrid}>
              <input type="text" placeholder="Nombre *" className={styles.input}
                value={form.nombre} onChange={handleChange('nombre')} />
              <input type="text" placeholder="Apellido *" className={styles.input}
                value={form.apellido} onChange={handleChange('apellido')} />
            </div>
            <input type="tel" placeholder="Celular (WhatsApp) *" className={styles.input}
              value={form.celular} onChange={handleChange('celular')} />
            <input type="email" placeholder="Email *" className={styles.input}
              value={form.email} onChange={handleChange('email')} />
          </section>

          {/* Paso 2: Envío */}
          <section className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>2. Dirección de Envío</h3>

            {selectedCoords && (
              <p className={styles.addressConfirmed}>✓ Dirección seleccionada correctamente</p>
            )}
            <div className={styles.addressWrapper}>
              <input
                type="text"
                placeholder="Ej: La Rioja 1138, Adrogué *"
                className={`${styles.input} ${selectedCoords ? styles.inputConfirmed : ''}`}
                value={direccion}
                onChange={e => handleAddressInput(e.target.value)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
              />
              {showDropdown && (
                <ul
                  className={styles.dropdown}
                  onMouseDown={e => e.preventDefault()}
                >
                  {suggestions.map((sug, i) => (
                    <li
                      key={i}
                      className={styles.dropdownItem}
                      onClick={() => handleSelectSuggestion(sug)}
                    >
                      {sug.display_name.split(',').slice(0, 4).join(',')}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button className={styles.calcBtn} onClick={handleCalcularEnvio} disabled={calculando}>
              {calculando
                ? <><Loader2 size={16} className={styles.spin} /> Calculando...</>
                : <><MapPin size={16} /> Calcular costo de envío</>
              }
            </button>

            {shippingError && <p className={styles.shippingError}>{shippingError}</p>}

            {shipping && (
              <div className={styles.shippingResult}>
                <Suspense fallback={<div className={styles.mapPlaceholder}>Cargando mapa...</div>}>
                  <ShippingMap storeCoords={shipping.storeCoords} clientCoords={shipping.clientCoords} />
                </Suspense>
                <div className={styles.shippingInfo}>
                  <span className={styles.shippingKm}>
                    Distancia: <strong>{shipping.km.toFixed(1)} km</strong>
                  </span>
                  {shipping.costo === 'convenir' ? (
                    <div className={styles.convenir}>
                      <p>Tu distancia supera los 10 km. El costo de envío se coordina por WhatsApp.</p>
                      <a href="https://wa.me/5491132024997" target="_blank" rel="noreferrer" className={styles.waLink}>
                        Contactar por WhatsApp
                      </a>
                    </div>
                  ) : (
                    <span className={styles.shippingCost}>
                      Envío: <strong>{formatPrice(shipping.costo)}</strong>
                    </span>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Paso 3: Pago */}
          <section className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>3. Método de Pago</h3>
            <p className={styles.disabledText}>Al clickear el botón serás redirigido a MercadoPago.</p>
          </section>
        </div>

        {/* ── Resumen ── */}
        <aside className={styles.summary}>
          <h3 className={styles.summaryTitle}>Resumen del Pedido</h3>
          <ul className={styles.itemsList}>
            {cart.map(item => (
              <li key={item.id} className={styles.summaryItem}>
                <span className={styles.summaryItemName}>{item.quantity}× {item.nombre}</span>
                <span>{formatPrice(item.precio * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className={styles.divider} />
          <div className={styles.totalRow}>
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {shipping && shipping.costo !== 'convenir' && (
            <div className={styles.totalRow}>
              <span>Envío</span>
              <span>{formatPrice(shipping.costo as number)}</span>
            </div>
          )}
          <div className={styles.divider} />
          <div className={`${styles.totalRow} ${styles.totalFinal}`}>
            <span>Total</span>
            <span className={styles.totalAmount}>{formatPrice(total)}</span>
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <Button
            variant="accent"
            fullWidth
            className={styles.mpBtn}
            onClick={handlePagar}
            disabled={paying || !shipping || shipping.costo === 'convenir'}
          >
            <CreditCard size={20} /> {paying ? 'Procesando...' : 'Pagar con MercadoPago'}
          </Button>

          <p className={styles.secureText}>
            <LockIcon /> Procesado de forma segura
          </p>
        </aside>

      </div>
    </main>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
