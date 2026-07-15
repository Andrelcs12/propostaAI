import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "@fastify/helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false })
  );

  app.setGlobalPrefix("api");
  await app.register(helmet);
  app.enableCors({
    origin: process.env.WEB_URL ?? "http://localhost:3000",
    credentials: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle("Novely SaaS Template API")
      .setDescription("API base para MicroSaaS da Novely")
      .setVersion("0.1.0")
      .addBearerAuth()
      .build()
  );
  SwaggerModule.setup("docs", app, document);

  const port = Number(process.env.PORT ?? process.env.API_PORT ?? 4000);
  await app.listen(port, "0.0.0.0");
  Logger.log(`API running on http://localhost:${port}/api`, "Bootstrap");
}

void bootstrap();
