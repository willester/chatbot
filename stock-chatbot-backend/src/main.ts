import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with options
  app.enableCors({
    origin: 'http://localhost:3000', // Replace with the actual URL of your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3001); // Ensure this port matches your backend's port
}

bootstrap();
