import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMensajeDto {
  @IsString()
  @MinLength(2)
  nombre!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsString()
  @MinLength(5)
  mensaje!: string;
}
