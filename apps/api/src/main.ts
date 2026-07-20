import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import fastifyStatic from "@fastify/static";
import helmet from "@fastify/helmet";
import multipart from "@fastify/multipart";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { AppModule } from "./app.module";
import { PrismaExceptionFilter } from "./common/filters/prisma-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
    { rawBody: true },
  );

  const uploadsRoot = join(process.cwd(), "uploads");
  mkdirSync(join(uploadsRoot, "logos"), { recursive: true });

  app.setGlobalPrefix("api");
  app.useGlobalFilters(new PrismaExceptionFilter());
  await app.register(helmet, { crossOriginResourcePolicy: { policy: "cross-origin" } });
  await app.register(multipart, {
    limits: {
      fileSize: 2 * 1024 * 1024,
      files: 1,
    },
  });
  await app.register(fastifyStatic, {
    root: uploadsRoot,
    prefix: "/uploads/",
    decorateReply: false,
  });
  app.enableCors({
    origin: process.env.WEB_URL ?? "http://localhost:3000",
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Render-Secret"],
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
