import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { envs } from './configuration/envs';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

    app.enableCors();

    app.setGlobalPrefix('api');

    app.useGlobalPipes(new ValidationPipe());

    await app.listen(envs.port);
}
bootstrap();