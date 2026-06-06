// --- Consultas de categorías a Supabase ---

import { supabase } from '../lib/supabase';
import type { Categoria } from '../types';

export async function getCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre');

  if (error) throw error;
  return data ?? [];
}
