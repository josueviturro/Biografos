// --- Selector de cantidad: menos / número / más ---

import { Minus, Plus } from 'lucide-react';
import styles from './QuantitySelector.module.css';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function QuantitySelector({ quantity, onIncrease, onDecrease }: QuantitySelectorProps) {
  return (
    <div className={styles.wrapper}>
      <button
        className={styles.btn}
        onClick={onDecrease}
        disabled={quantity <= 1}
        aria-label="Disminuir cantidad"
      >
        <Minus size={16} />
      </button>
      <span className={styles.value}>{quantity}</span>
      <button
        className={styles.btn}
        onClick={onIncrease}
        aria-label="Aumentar cantidad"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
