// --- Consultas de órdenes a Supabase ---

import { supabase } from '../lib/supabase';
import type { CartItem } from '../types';

export interface OrdenInput {
  cliente_nombre: string;
  cliente_apellido: string;
  cliente_email: string;
  cliente_celular: string;
  cliente_direccion: string;
  total: number;
  mp_preference_id?: string;
}

export interface ItemOrden {
  id: string;
  orden_id: string;
  producto_nombre: string;
  precio: number;
  cantidad: number;
}

export interface Orden {
  id: string;
  numero: number;
  cliente_nombre: string;
  cliente_apellido: string;
  cliente_email: string;
  cliente_celular: string;
  cliente_direccion: string;
  total: number;
  estado: string;
  mp_preference_id: string | null;
  created_at: string;
  items_orden: ItemOrden[];
}

// Crear orden con sus items
export async function createOrden(orden: OrdenInput, items: CartItem[]): Promise<Orden> {
  const { data: ordenData, error: ordenError } = await supabase
    .from('ordenes')
    .insert(orden)
    .select()
    .single();

  if (ordenError) throw ordenError;

  const itemsData = items.map(item => ({
    orden_id: ordenData.id,
    producto_nombre: item.nombre,
    precio: item.precio,
    cantidad: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from('items_orden')
    .insert(itemsData);

  if (itemsError) throw itemsError;

  return { ...ordenData, items_orden: itemsData };
}

// Traer todas las órdenes con sus items
export async function getOrdenes(): Promise<Orden[]> {
  const { data, error } = await supabase
    .from('ordenes')
    .select(`*, items_orden(*)`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// Actualizar estado de una orden
export async function updateOrdenEstado(id: string, estado: string): Promise<void> {
  const { error } = await supabase
    .from('ordenes')
    .update({ estado })
    .eq('id', id);

  if (error) throw error;
}

// Eliminar una orden
export async function deleteOrden(id: string): Promise<void> {
  const { error } = await supabase
    .from('ordenes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
