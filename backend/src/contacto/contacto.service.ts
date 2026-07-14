import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMensajeDto } from './dto/contacto.dto';

@Injectable()
export class ContactoService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateMensajeDto) {
    return this.prisma.mensaje.create({ data: dto });
  }

  findAll() {
    return this.prisma.mensaje.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async marcarLeido(id: number) {
    const mensaje = await this.prisma.mensaje.findUnique({ where: { id } });
    if (!mensaje) {
      throw new NotFoundException('Mensaje no encontrado');
    }
    return this.prisma.mensaje.update({ where: { id }, data: { leido: true } });
  }
}
