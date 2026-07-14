import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Rol } from '@prisma/client';
import { ContactoService } from './contacto.service';
import { CreateMensajeDto } from './dto/contacto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('contacto')
@Controller('contacto')
export class ContactoController {
  constructor(private readonly contactoService: ContactoService) {}

  @Post()
  create(@Body() dto: CreateMensajeDto) {
    return this.contactoService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN)
  findAll() {
    return this.contactoService.findAll();
  }

  @Patch(':id/leido')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN)
  marcarLeido(@Param('id', ParseIntPipe) id: number) {
    return this.contactoService.marcarLeido(id);
  }
}
