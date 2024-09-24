import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { JwtMiddleware } from './usuarios/auth/middlewares/jwt/jwt.middleware';
import { db } from './configuration';

@Module({
  imports: [TypeOrmModule.forRoot(db), UsuariosModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(JwtMiddleware)
          .exclude(
            {
                path: '/usuarios/auth/login',
                method: RequestMethod.POST,
            },
            {
                path: '/usuarios/auth/register',
                method: RequestMethod.POST,
            },
          ).forRoutes('');
    }
}
