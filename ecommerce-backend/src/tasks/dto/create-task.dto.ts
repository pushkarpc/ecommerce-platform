import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  description?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
