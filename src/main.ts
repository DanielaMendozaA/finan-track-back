import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

import { setupGlobalConfig } from './common/config/global-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT_DANY') || 3001;
  const logger = new Logger('Boostrap');
  app.enableCors();

  app.setGlobalPrefix('api/v1');

  setupGlobalConfig(app);
  await app.listen(PORT);
  logger.log(`Application is running on port ${PORT}`);
}
bootstrap();
