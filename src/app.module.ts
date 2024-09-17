import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthService } from './auth/auth.service';
import { JwtMiddleware } from './usuarios/auth/middlewares/jwt/jwt.middleware';

@Module({
  imports: [
    /** Las configuraciones de este módulo ahora son globales
     * y abarcan a toda la aplicación
     */
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
        type: 'mysql',
        host: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DATABASE,
        entities: [],
        autoLoadEntities: true, // carga las entidades
        synchronize: true // realiza las migraciones de las tablas automáticamente
    }),
    UsuariosModule
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
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
