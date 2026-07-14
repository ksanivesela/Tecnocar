import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductoDto, QueryProductoDto, UpdateProductoDto } from './dto/producto.dto';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryProductoDto) {
    const where: Prisma.ProductoWhereInput = { activo: true };

    if (query.categoria && query.categoria !== 'Todos') {
      where.categoria = { nombre: query.categoria };
    }

    if (query.search) {
      where.OR = [
        { nombre: { contains: query.search, mode: 'insensitive' } },
        { marca: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.producto.findMany({
      where,
      include: { categoria: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findFeatured() {
    return this.prisma.producto.findMany({
      where: { activo: true, destacado: true },
      include: { categoria: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });
  }

  async findOne(id: number) {
    const producto = await this.prisma.producto.findFirst({
      where: { id, activo: true },
      include: { categoria: true },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    return producto;
  }

  async findAllForAdmin() {
    return this.prisma.producto.findMany({
      include: { categoria: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateProductoDto, imagen?: string) {
    return this.prisma.producto.create({
      data: {
        nombre: dto.nombre,
        marca: dto.marca,
        descripcion: dto.descripcion,
        precio: dto.precio,
        stock: dto.stock,
        categoriaId: dto.categoriaId,
        vehiculosCompatibles: dto.vehiculosCompatibles ?? [],
        destacado: dto.destacado ?? false,
        imagen: imagen ?? '',
      },
      include: { categoria: true },
    });
  }

  async update(id: number, dto: UpdateProductoDto, imagen?: string) {
    await this.findByIdOrFail(id);

    return this.prisma.producto.update({
      where: { id },
      data: {
        ...dto,
        ...(imagen ? { imagen } : {}),
      },
      include: { categoria: true },
    });
  }

  async remove(id: number) {
    await this.findByIdOrFail(id);
    await this.prisma.producto.update({ where: { id }, data: { activo: false } });
    return { id };
  }

  private async findByIdOrFail(id: number) {
    const producto = await this.prisma.producto.findUnique({ where: { id } });
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }
    return producto;
  }
}
