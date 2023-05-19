import { NestFactory} from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: /.*/,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/v1');
  app.use(helmet());
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const config = new DocumentBuilder()
    .setTitle('AZIZ-REMIT API PLATFORM')
    .setDescription('Description')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .setVersion('3.0')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [],
  });

  SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
