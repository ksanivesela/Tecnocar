import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { EstadoReserva } from '@prisma/client';

export class CreateReservaDto {
  @IsString()
  @MinLength(2)
  nombre!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  telefono!: string;

  @IsString()
  @MinLength(2)
  vehiculo!: string;

  @IsString()
  @MinLength(2)
  placa!: string;

  @IsString()
  @MinLength(2)
  servicio!: string;

  @Type(() => Date)
  @IsDate({ message: 'Fecha no válida' })
  fecha!: Date;

  @IsOptional()
  @IsString()
  observacion?: string;
}

export class UpdateEstadoReservaDto {
  @IsEnum(EstadoReserva)
  estado!: EstadoReserva;
}
