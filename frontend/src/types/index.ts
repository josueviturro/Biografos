// --- Tipos globales de la aplicación ---

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type PageView = 'home' | 'catalog' | 'product-detail' | 'cart' | 'checkout';
