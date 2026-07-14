import { Injectable } from '@nestjs/common';
import { EstadoPedido } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [productos, reservas, pedidos, pedidoEmails, reservaEmails] = await Promise.all([
      this.prisma.producto.count({ where: { activo: true } }),
      this.prisma.reserva.count(),
      this.prisma.pedido.count(),
      this.prisma.pedido.findMany({ select: { email: true }, distinct: ['email'] }),
      this.prisma.reserva.findMany({ select: { email: true }, distinct: ['email'] }),
    ]);

    const clientesUnicos = new Set([
      ...pedidoEmails.map((p) => p.email),
      ...reservaEmails.map((r) => r.email),
    ]);

    return { productos, reservas, pedidos, clientes: clientesUnicos.size };
  }

  async getRevenue() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const pedidos = await this.prisma.pedido.findMany({
      where: { createdAt: { gte: start }, estado: { not: EstadoPedido.CANCELADO } },
      select: { total: true, createdAt: true },
    });

    const buckets = new Map<string, number>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.set(`${d.getFullYear()}-${d.getMonth()}`, 0);
    }

    for (const pedido of pedidos) {
      const key = `${pedido.createdAt.getFullYear()}-${pedido.createdAt.getMonth()}`;
      if (buckets.has(key)) {
        buckets.set(key, buckets.get(key)! + pedido.total);
      }
    }

    return Array.from(buckets.entries()).map(([key, total]) => {
      const month = Number(key.split('-')[1]);
      return { month: MESES[month], total: Math.round(total * 100) / 100 };
    });
  }

  async getActivity() {
    const [productos, pedidos, reservas] = await Promise.all([
      this.prisma.producto.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { nombre: true, createdAt: true },
      }),
      this.prisma.pedido.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { nombre: true, total: true, createdAt: true },
      }),
      this.prisma.reserva.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { nombre: true, servicio: true, createdAt: true },
      }),
    ]);

    const eventos = [
      ...productos.map((p) => ({
        mensaje: `Nuevo producto agregado: ${p.nombre}`,
        fecha: p.createdAt,
      })),
      ...pedidos.map((p) => ({
        mensaje: `Nuevo pedido de ${p.nombre} por $${p.total.toFixed(2)}`,
        fecha: p.createdAt,
      })),
      ...reservas.map((r) => ({
        mensaje: `Nueva reserva de ${r.nombre} para ${r.servicio}`,
        fecha: r.createdAt,
      })),
    ];

    return eventos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime()).slice(0, 8);
  }
}
