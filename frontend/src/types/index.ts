// --- Tipos que reflejan exactamente el schema de Supabase ---

export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  created_at?: string;
}

export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_anterior?: number;
  stock: number;
  imagenes: string[];
  categoria_id: string;
  slug: string;
  activo: boolean;
  created_at?: string;
  categorias?: Categoria | null;  // viene del join con la tabla categorias
}

export interface CartItem extends Product {
  quantity: number;
}
