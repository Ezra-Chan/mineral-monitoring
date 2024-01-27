import 'dotenv/config';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpFilter } from 'src/common/filter';
import { TransformInterceptor } from 'src/common/response';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 异常过滤器
  app.useGlobalFilters(new HttpFilter());
  // 响应拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(bodyParser.json({ limit: '1mb' }));
  // 跨域
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
