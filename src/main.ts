import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { TransformInterceptor } from './transform.interceptor';
import helmet from 'helmet';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	
	// Security
	app.use(helmet());
	
	// CORS
	app.enableCors({
		origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
		credentials: true,
	});
	
	// Validation
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new TransformInterceptor());
	
	await app.listen(3000);
}
bootstrap();
