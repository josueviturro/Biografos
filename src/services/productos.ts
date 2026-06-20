// --- Consultas de productos a Supabase ---

import { supabase } from '../lib/supabase';
import { compressImage } from '../utils/compressImage';
import type { Product } from '../types';

export async function uploadImagenProducto(file: File): Promise<string> {
  const compressed = await compressImage(file);
  const fileName = `${crypto.randomUUID()}.jpg`;

  const { error } = await supabase.storage
    .from('productos')
    .upload(fileName, compressed, { contentType: 'image/jpeg' });

  if (error) throw error;

  const { data } = supabase.storage.from('productos').getPublicUrl(fileName);
  return data.publicUrl;
}

export async function getProductos(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('productos')
    .select(`*, categorias(id, nombre, slug)`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getProductoById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('productos')
    .select(`*, categorias(id, nombre, slug)`)
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function createProducto(producto: Omit<Product, 'id' | 'created_at' | 'categorias'>): Promise<Product> {
  const { data, error } = await supabase
    .from('productos')
    .insert(producto)
    .select(`*, categorias(id, nombre, slug)`)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProducto(id: string, producto: Partial<Omit<Product, 'id' | 'created_at' | 'categorias'>>): Promise<Product> {
  const { data, error } = await supabase
    .from('productos')
    .update(producto)
    .eq('id', id)
    .select(`*, categorias(id, nombre, slug)`)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProducto(id: string): Promise<void> {
  const { error } = await supabase
    .from('productos')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
