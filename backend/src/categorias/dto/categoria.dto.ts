import { IsString, MinLength } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @MinLength(2)
  nombre!: string;
}

export class UpdateCategoriaDto {
  @IsString()
  @MinLength(2)
  nombre!: string;
}
