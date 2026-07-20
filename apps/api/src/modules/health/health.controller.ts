import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../../database/prisma.service";

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOkResponse({ description: "Status da API e do banco" })
  async getHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: "ok" as const,
        database: "ok" as const,
      };
    } catch (error) {
      throw new ServiceUnavailableException({
        status: "degraded",
        database: "unavailable",
        message:
          "PostgreSQL indisponivel. Inicie o Docker Desktop e execute npm run db:up.",
        detail: error instanceof Error ? error.message : "unknown error",
      });
    }
  }
}
