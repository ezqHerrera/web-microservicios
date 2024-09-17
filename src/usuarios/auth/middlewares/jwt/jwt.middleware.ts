import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly usuariosService: UsuariosService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    try {
        // obtenemos el token desde los headers de la petición y lo separamos del bearer
        const tokenArray: string[] = req.headers['authorization'].split(' ');

        const decodedToken = await this.authService.verifyJwt(tokenArray[1]);

        if (decodedToken) {
            const usuario = await this.usuariosService.getOne(decodedToken.sub);
            if (usuario) next();
            else throw new UnauthorizedException('Token inválido');
        } else {
            throw new UnauthorizedException('Token inválido');
        }
    } catch (error) {
        console.error(error);
        throw new UnauthorizedException('Token inválido');
    }

    next();
  }
}
