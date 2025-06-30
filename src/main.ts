import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';
import { ErrorFilter } from './filters/error.filter';
import {
  MyThrottleErrorFilter,
  ThrottleErrorFilter,
} from './filters/throttle.filter';
import helmet from 'helmet';
import { IncidentsService } from './modules/incidents/incidents.service';
import './sentry';

async function bootstrap() {
  const port = process.env.PORT || 8000;
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    logger: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
  });
  app.useGlobalPipes(
    new ValidationPipe(),
  );
  const incidents = app.get<IncidentsService>(IncidentsService);
  app.useGlobalFilters(
    new ThrottleErrorFilter(),
    new MyThrottleErrorFilter(),
    new ErrorFilter(incidents),
  );
  app.use(helmet());
  app.enableCors();
  //app.use(logger);
  // app.enableCors({
  //   origin: function (origin, callback) {
  //     const allowedOrigins = [process.env.APP_CORS_URL, 'http://localhost:5173'];
  //     if (allowedOrigins.indexOf(origin) !== -1) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error('Not allowed by CORS'));
  //     }
  //   },
  // });
  console.info('Server started on port ' + port + ' 🔥');
  console.info('HTTP Address: http://127.0.0.1:' + port + '/');
  await app.listen(port, '0.0.0.0');
}
bootstrap();
