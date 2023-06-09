import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { logger } from '../logtail.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const winstonLogger = WinstonModule.createLogger(
    logger(process.env.LOGTAIL_SOURCE_TOKEN),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const PORT = process.env.API_PORT || 3000;
  app.useLogger(winstonLogger);
  await app.listen(PORT);

  console.log(`Backend runninng on port:  ${PORT}`);
}
bootstrap();
