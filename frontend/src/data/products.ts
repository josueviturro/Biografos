// --- Datos mock (reemplazados por Supabase — solo para fallback/dev) ---

import type { Product } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    nombre: 'Cama de Pino Macizo con Cabecero',
    precio: 350000,
    stock: 5,
    descripcion: 'Cama de diseño robusto fabricada en madera de pino macizo.',
    imagenes: [],
    categoria_id: '1',
    slug: 'cama-pino-macizo',
    activo: true,
    categorias: { id: '1', nombre: 'Dormitorio', slug: 'dormitorio' },
  },
  {
    id: '2',
    nombre: 'Mesa de Comedor Rústica de Pino',
    precio: 280000,
    stock: 8,
    descripcion: 'Mesa de comedor rectangular de pino macizo.',
    imagenes: [],
    categoria_id: '2',
    slug: 'mesa-comedor-rustica',
    activo: true,
    categorias: { id: '2', nombre: 'Mesas', slug: 'mesas' },
  },
  {
    id: '3',
    nombre: 'Silla de Pino con Asiento Tejido',
    precio: 65000,
    stock: 20,
    descripcion: 'Silla de pino con asiento tejido en fibras naturales.',
    imagenes: [],
    categoria_id: '3',
    slug: 'silla-pino-tejido',
    activo: true,
    categorias: { id: '3', nombre: 'Sillas', slug: 'sillas' },
  },
];

export const CATEGORIES = ['Todos', 'Dormitorio', 'Mesas', 'Sillas', 'Almacenamiento', 'Recibidor'];
