import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
      .setTitle('Credits API')
      .setDescription('Credit management endpoints')
      .setVersion('1.0')
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
console.log('Loaded DB ENV:', {
  password: process.env.DATABASE_PASSWORD,
  typeofPassword: typeof process.env.DATABASE_PASSWORD,
});
bootstrap();
