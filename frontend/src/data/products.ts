// --- Datos mock de productos (reemplazar con llamadas a Supabase) ---

import type { Product } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Cama de Pino Macizo con Cabecero',
    price: 350000,
    stock: 5,
    description: 'Cama de diseño robusto fabricada en madera de pino macizo. Acabado natural que resalta la veta de la madera, con un cabecero alto y elegante. Ideal para un dormitorio cálido y acogedor.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068b574?auto=format&fit=crop&w=1470&q=80',
    category: 'Dormitorio',
  },
  {
    id: 2,
    name: 'Mesa de Comedor Rústica de Pino',
    price: 280000,
    stock: 8,
    description: 'Mesa de comedor rectangular de pino macizo con un estilo rústico y auténtico. Perfecta para reuniones familiares, con capacidad para 6-8 personas. Acabado encerado para mayor durabilidad.',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1469&q=80',
    category: 'Mesas',
  },
  {
    id: 3,
    name: 'Silla de Pino con Asiento Tejido',
    price: 65000,
    stock: 20,
    description: 'Silla de pino con un diseño tradicional y asiento tejido en fibras naturales. Ligera pero resistente, aporta un toque artesanal y cómodo a cualquier comedor o cocina.',
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=687&q=80',
    category: 'Sillas',
  },
  {
    id: 4,
    name: 'Cómoda de Pino con 6 Cajones',
    price: 195000,
    stock: 4,
    description: 'Amplia cómoda de pino con seis cajones espaciosos. Diseño funcional con tiradores de madera integrados. Ideal para organizar ropa y accesorios en el dormitorio.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1470&q=80',
    category: 'Almacenamiento',
  },
  {
    id: 5,
    name: 'Armario de Pino 2 Puertas',
    price: 420000,
    stock: 3,
    description: 'Armario ropero de pino macizo con dos puertas batientes y barra para colgar. Incluye estante superior para almacenamiento adicional. Diseño clásico y atemporal.',
    image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=1632&q=80',
    category: 'Dormitorio',
  },
  {
    id: 6,
    name: 'Banco de Entrada de Pino',
    price: 90000,
    stock: 10,
    description: 'Banco versátil de pino para la entrada o el pie de cama. Diseño simple y elegante con espacio de almacenamiento inferior para zapatos o cestas.',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=764&q=80',
    category: 'Recibidor',
  },
];

export const CATEGORIES = ['Todos', 'Dormitorio', 'Mesas', 'Sillas', 'Almacenamiento', 'Recibidor'];
