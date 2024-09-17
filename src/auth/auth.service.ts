import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsuariosDto } from 'src/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from 'src/usuarios/usuarios.entity';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService,
                @InjectRepository(Usuarios) private readonly repo: Repository<UsuariosDto>,
    ) {}

    /**
     * @description compara el token de la sesión del usuario
     * @param jwt jwt del cliente
     * @returns payload
     */
    async verifyJwt(jwt: string): Promise<any> {
        return await this.jwtService.verifyAsync(jwt);
    }

    /**
     * @param Usuario
     * @returns token generado
     */
    async generateJwt(user: UsuariosDto): Promise<string> {
        /**
         * @description creamos el payload con la información del usuario
         */
        const payload = {
            sub: user.id,
            email: user.email,
            nombre: user.nombre,
        };

        return this.jwtService.signAsync(payload);
    }

    /**
     * @param password contraseña de usuario nuevo
     * @returns contraseña hasheada
     */
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    /**
     * @description compara la contraseña del login con la almacenada
     * @param password contraseña ingresada
     * @param hashPassword contraseña almacenada
     * @returns boolean
     */
    async comparePassword(
        password: string,
        hashPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(password, hashPassword);
    }
}
