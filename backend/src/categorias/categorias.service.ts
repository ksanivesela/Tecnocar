import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto/categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
      include: { _count: { select: { productos: true } } },
    });
  }

  async create(dto: CreateCategoriaDto) {
    return this.prisma.categoria.create({ data: dto });
  }

  async update(id: number, dto: UpdateCategoriaDto) {
    await this.findOneOrFail(id);
    return this.prisma.categoria.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const categoria = await this.findOneOrFail(id);
    const productos = await this.prisma.producto.count({ where: { categoriaId: id } });

    if (productos > 0) {
      throw new ConflictException(
        'No se puede eliminar una categoría que tiene productos asociados',
      );
    }

    await this.prisma.categoria.delete({ where: { id: categoria.id } });
    return { id: categoria.id };
  }

  private async findOneOrFail(id: number) {
    const categoria = await this.prisma.categoria.findUnique({ where: { id } });
    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return categoria;
  }
}
