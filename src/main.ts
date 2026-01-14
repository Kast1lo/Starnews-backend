import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // преобразовывать DTO в классы
    whitelist: true, // удалять лишние свойства из запроса
    forbidNonWhitelisted: true // Выдавать ошибку, если есть лишние свойства
  }))
  app.enableCors({
    origin: 'http://localhost:4200',
    Credential: true, // РАзврешить передачу cookies
    methods: [ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS' ]
  })
  await app.listen(process.env.PORT ?? 4100);
  console.log('API is running on http://localhost:4100');
}
bootstrap();
