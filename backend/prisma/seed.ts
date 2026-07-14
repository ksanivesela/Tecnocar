import 'dotenv/config';
import { PrismaClient, Rol } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL!) });

const ADMIN_EMAIL = 'admin@tecnocar.com';
const ADMIN_PASSWORD = 'Tecnocar2026!';

const CATEGORIAS = ['Repuestos', 'Partes Mecánicas', 'Lubricantes', 'Filtros', 'Accesorios', 'Limpieza'];

const PLACEHOLDER = '/uploads/productos/placeholder.svg';

const PRODUCTOS = [
  {
    nombre: 'Discos de freno ventilados',
    marca: 'Brembo',
    categoria: 'Repuestos',
    descripcion: 'Discos de freno ventilados de alto rendimiento, mayor disipación de calor y frenado más seguro.',
    precio: 45,
    stock: 15,
    vehiculosCompatibles: ['Toyota', 'Chevrolet', 'Nissan'],
    destacado: true,
  },
  {
    nombre: 'Pastillas de freno cerámicas',
    marca: 'Bosch',
    categoria: 'Repuestos',
    descripcion: 'Pastillas cerámicas de baja generación de polvo y frenado silencioso.',
    precio: 28,
    stock: 20,
    vehiculosCompatibles: ['Toyota', 'Hyundai', 'Kia'],
    destacado: true,
  },
  {
    nombre: 'Amortiguadores delanteros',
    marca: 'Monroe',
    categoria: 'Partes Mecánicas',
    descripcion: 'Amortiguadores delanteros de gas, mejoran la estabilidad y el confort de manejo.',
    precio: 65,
    stock: 10,
    vehiculosCompatibles: ['Mazda', 'Nissan', 'Chevrolet'],
    destacado: false,
  },
  {
    nombre: 'Bujías de iridio',
    marca: 'NGK',
    categoria: 'Partes Mecánicas',
    descripcion: 'Bujías de iridio de larga duración, mejor encendido y ahorro de combustible.',
    precio: 12,
    stock: 40,
    vehiculosCompatibles: ['Toyota', 'Hyundai', 'Kia'],
    destacado: true,
  },
  {
    nombre: 'Aceite sintético 5W30',
    marca: 'Mobil',
    categoria: 'Lubricantes',
    descripcion: 'Aceite 100% sintético, protección superior del motor en cualquier condición.',
    precio: 38,
    stock: 30,
    vehiculosCompatibles: ['Universal'],
    destacado: true,
  },
  {
    nombre: 'Filtro de aceite',
    marca: 'Mann',
    categoria: 'Filtros',
    descripcion: 'Filtro de aceite de alta filtración, protege el motor de impurezas.',
    precio: 14,
    stock: 25,
    vehiculosCompatibles: ['Mazda', 'Ford', 'Chevrolet'],
    destacado: false,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.usuario.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      nombres: 'Admin',
      apellidos: 'Tecnocar',
      email: ADMIN_EMAIL,
      password: passwordHash,
      rol: Rol.ADMIN,
    },
  });
  console.log(`Usuario admin listo: ${ADMIN_EMAIL}`);

  const categoriaIds = new Map<string, number>();
  for (const nombre of CATEGORIAS) {
    const categoria = await prisma.categoria.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
    categoriaIds.set(nombre, categoria.id);
  }
  console.log(`Categorías listas: ${CATEGORIAS.join(', ')}`);

  for (const producto of PRODUCTOS) {
    const existente = await prisma.producto.findFirst({ where: { nombre: producto.nombre } });
    if (existente) continue;

    await prisma.producto.create({
      data: {
        nombre: producto.nombre,
        marca: producto.marca,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        vehiculosCompatibles: producto.vehiculosCompatibles,
        destacado: producto.destacado,
        imagen: PLACEHOLDER,
        categoriaId: categoriaIds.get(producto.categoria)!,
      },
    });
  }
  console.log(`Productos de ejemplo listos (${PRODUCTOS.length})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
