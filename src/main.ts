import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PORT } from './@common/environment-contants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Abstractor')
    .setDescription(
      'Abstração para gerenciamento de usuários e meios de pagamento aplicável para diversos tipos de plataforma',
    )
    .setVersion('3.1.0')
    .addApiKey({ type: 'apiKey', name: 'apikey', in: 'header' }, 'api-key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
