// --- Tipos globales de la aplicación ---

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

// Vistas disponibles de la SPA (sin router por ahora)
export type PageView = 'home' | 'catalog' | 'product-detail' | 'cart' | 'checkout';
