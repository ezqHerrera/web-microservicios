import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from './usuarios.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { UsuariosDto } from './usuarios.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsuariosService {
    constructor(
        // Repository se utiliza para interactuar con la base de datos
        @InjectRepository(Usuarios) private readonly repo: Repository<UsuariosDto>,
        private readonly authService: AuthService,
    ) {}

    async register(usuario: UsuariosDto) {
        try {
            if (!usuario.password) throw new UnauthorizedException('No existe la contraseña');

            const hash = await this.authService.hashPassword(usuario.password);
            usuario.password = hash;

            const result = await this.repo.save(usuario);
            return result;
        } catch (error) {
            console.error(error);
            if (error instanceof QueryFailedError) {
                throw new HttpException(`${error.name} ${error.driverError}`, 404);
            }
            throw new HttpException(error.message, error.status);
        }
    }

    /**
     * @description Obtiene un usuario
     * @param id ID del usuario
     * @returns UsuariosDTO
     */
    async getOne(id: number): Promise<UsuariosDto> {
        try {
            const usuario = await this.repo.findOne({ where: {id} });
            if (!usuario) throw new NotFoundException('Usuario no encontrado');
            return usuario;
        } catch (error) {
            console.error(error);
            if (error instanceof QueryFailedError) {
                throw new HttpException(`${error.name} ${error.driverError}`, 404);
            }
            throw new HttpException(error.message, error.status);
        }
    }

}
