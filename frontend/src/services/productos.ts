// --- Consultas de productos a Supabase ---

import { supabase } from '../lib/supabase';
import type { Product } from '../types';

// Trae todos los productos activos con su categoría
export async function getProductos(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('productos')
    .select(`*, categorias(id, nombre, slug)`)
    .eq('activo', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// Trae un producto por su slug o id
export async function getProductoById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('productos')
    .select(`*, categorias(id, nombre, slug)`)
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

// Trae productos por categoría
export async function getProductosByCategoria(categoriaId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('productos')
    .select(`*, categorias(id, nombre, slug)`)
    .eq('categoria_id', categoriaId)
    .eq('activo', true);

  if (error) throw error;
  return data ?? [];
}
