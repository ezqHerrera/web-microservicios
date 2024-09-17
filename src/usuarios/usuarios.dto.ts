import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
export class UsuariosDto {
    id: number;

    @IsString()
    nombre: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean = true;
}