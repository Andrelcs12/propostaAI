import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Prisma } from "../../generated/prisma/client";
import type { FastifyReply } from "fastify";

function isDatabaseConnectionError(exception: unknown) {
  if (!(exception instanceof Error)) {
    return false;
  }

  const combined = `${exception.name} ${exception.message}`.toLowerCase();

  return (
    combined.includes("econnrefused") ||
    combined.includes("can't reach database server") ||
    combined.includes("connection terminated") ||
    combined.includes("connect etimedout")
  );
}

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientRustPanicError,
  Prisma.PrismaClientUnknownRequestError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<FastifyReply>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Erro interno do banco de dados.";

    if (
      exception instanceof Prisma.PrismaClientInitializationError ||
      isDatabaseConnectionError(exception)
    ) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message =
        "Banco de dados indisponivel. Inicie o Docker Desktop, execute npm run db:up e npm run db:migrate.";
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case "P1001":
        case "ECONNREFUSED":
        case "ETIMEDOUT":
          status = HttpStatus.SERVICE_UNAVAILABLE;
          message =
            "Nao foi possivel conectar ao banco de dados. Verifique se o PostgreSQL esta rodando.";
          break;
        case "P2002":
          status = HttpStatus.CONFLICT;
          message = "Ja existe um registro com estes dados.";
          break;
        case "P2021":
        case "P2022":
          status = HttpStatus.SERVICE_UNAVAILABLE;
          message =
            "Estrutura do banco desatualizada. Execute npm run db:migrate.";
          break;
        default:
          this.logger.error(
            `Prisma error ${exception.code}: ${exception.message}`,
          );
      }
    } else {
      this.logger.error(exception);
    }

    void response.status(status).send({
      statusCode: status,
      message,
    });
  }
}
