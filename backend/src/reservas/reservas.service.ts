import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservaDto, UpdateEstadoReservaDto } from './dto/reserva.dto';

@Injectable()
export class ReservasService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateReservaDto) {
    return this.prisma.reserva.create({ data: dto });
  }

  findAll() {
    return this.prisma.reserva.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async updateEstado(id: number, dto: UpdateEstadoReservaDto) {
    const reserva = await this.prisma.reserva.findUnique({ where: { id } });
    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }
    return this.prisma.reserva.update({ where: { id }, data: { estado: dto.estado } });
  }
}
