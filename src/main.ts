import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { envs } from './configuration';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

    app.enableCors();

    app.setGlobalPrefix('api');

    app.useGlobalPipes(new ValidationPipe());

    console.log(`Corriendo en ${envs.port}`);
    await app.listen(envs.port);
}
bootstrap();