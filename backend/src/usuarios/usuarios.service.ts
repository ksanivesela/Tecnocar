import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/usuario.dto';

const SAFE_SELECT = {
  id: true,
  nombres: true,
  apellidos: true,
  email: true,
  telefono: true,
  rol: true,
  createdAt: true,
  _count: { select: { pedidos: true, reservas: true } },
} as const;

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.usuario.findMany({
      select: SAFE_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateUsuarioDto) {
    const existente = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existente) {
      throw new ConflictException('Ya existe un usuario con ese correo');
    }

    const password = await bcrypt.hash(dto.password, 10);

    return this.prisma.usuario.create({
      data: { ...dto, password },
      select: SAFE_SELECT,
    });
  }
}
