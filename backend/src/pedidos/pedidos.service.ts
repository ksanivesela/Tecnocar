import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto, UpdateEstadoPedidoDto } from './dto/pedido.dto';

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePedidoDto) {
    const productoIds = dto.items.map((item) => item.productoId);
    const productos = await this.prisma.producto.findMany({
      where: { id: { in: productoIds }, activo: true },
    });

    for (const item of dto.items) {
      const producto = productos.find((p) => p.id === item.productoId);
      if (!producto) {
        throw new BadRequestException(`Producto ${item.productoId} no existe o no está disponible`);
      }
      if (producto.stock < item.cantidad) {
        throw new BadRequestException(`Stock insuficiente para "${producto.nombre}"`);
      }
    }

    const total = dto.items.reduce((sum, item) => {
      const producto = productos.find((p) => p.id === item.productoId)!;
      return sum + producto.precio * item.cantidad;
    }, 0);

    return this.prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.create({
        data: {
          nombre: dto.nombre,
          email: dto.email,
          telefono: dto.telefono,
          total,
          detalles: {
            create: dto.items.map((item) => {
              const producto = productos.find((p) => p.id === item.productoId)!;
              return {
                productoId: item.productoId,
                cantidad: item.cantidad,
                precio: producto.precio,
              };
            }),
          },
        },
        include: { detalles: { include: { producto: true } } },
      });

      for (const item of dto.items) {
        await tx.producto.update({
          where: { id: item.productoId },
          data: { stock: { decrement: item.cantidad } },
        });
      }

      return pedido;
    });
  }

  findAll() {
    return this.prisma.pedido.findMany({
      include: { detalles: { include: { producto: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: { detalles: { include: { producto: true } } },
    });

    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }

    return pedido;
  }

  async updateEstado(id: number, dto: UpdateEstadoPedidoDto) {
    await this.findOne(id);
    return this.prisma.pedido.update({ where: { id }, data: { estado: dto.estado } });
  }
}
