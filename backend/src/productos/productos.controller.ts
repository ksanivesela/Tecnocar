import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Rol } from '@prisma/client';
import { ProductosService } from './productos.service';
import { CreateProductoDto, QueryProductoDto, UpdateProductoDto } from './dto/producto.dto';
import { productosMulterOptions } from './multer.config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get('destacados')
  findFeatured() {
    return this.productosService.findFeatured();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN)
  findAllForAdmin() {
    return this.productosService.findAllForAdmin();
  }

  @Get()
  findAll(@Query() query: QueryProductoDto) {
    return this.productosService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN)
  @UseInterceptors(
    FileInterceptor('imagen', productosMulterOptions(process.env.UPLOADS_DIR ?? 'uploads')),
  )
  create(@Body() dto: CreateProductoDto, @UploadedFile() file?: Express.Multer.File) {
    return this.productosService.create(dto, file && `/uploads/productos/${file.filename}`);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN)
  @UseInterceptors(
    FileInterceptor('imagen', productosMulterOptions(process.env.UPLOADS_DIR ?? 'uploads')),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productosService.update(id, dto, file && `/uploads/productos/${file.filename}`);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }
}
