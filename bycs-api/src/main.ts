import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./exception-filters/global.exception-filter";
import { RequestDtoValidationPipe } from "./pipes/request-dto-validation.pipe";
import { setupSwagger } from "./swagger/setup.swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    defaultVersion: "1",
    type: VersioningType.URI,
  });

  app.setGlobalPrefix("api");

  setupSwagger(app);

  app.useGlobalPipes(new RequestDtoValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();
