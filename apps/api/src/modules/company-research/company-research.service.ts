import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import { InMemoryRateLimiter } from "../../common/utils/rate-limiter";
import { assertPublicUrl, normalizeOptionalUrl } from "../../common/utils/url-security";
import { GeminiService } from "../proposals/gemini.service";
import type { CompanyAnalysis } from "../proposals/gemini.schemas";
import type { AnalyzeCompanyDto, SearchCompanyDto } from "./dto/search-company.dto";

type CacheEntry = {
  expiresAt: number;
  data: CompanyAnalysis;
};

@Injectable()
export class CompanyResearchService {
  private readonly searchLimiter = new InMemoryRateLimiter(10, 60_000);
  private readonly analyzeLimiter = new InMemoryRateLimiter(10, 60_000);
  private readonly cache = new Map<string, CacheEntry>();

  constructor(private readonly geminiService: GeminiService) {}

  async searchCompanies(userId: string, dto: SearchCompanyDto) {
    this.ensureAllowed(this.searchLimiter, `search:${userId}`);

    if (!dto.name.trim()) {
      throw new BadRequestException("Informe o nome da empresa.");
    }

    const website = normalizeOptionalUrl(dto.website);
    if (website) {
      await assertPublicUrl(website);
    }

    return this.geminiService.searchCompanies({
      name: dto.name.trim(),
      city: dto.city?.trim(),
      state: dto.state?.trim(),
      website: website ?? undefined,
    });
  }

  async analyzeCompany(userId: string, dto: AnalyzeCompanyDto) {
    this.ensureAllowed(this.analyzeLimiter, `analyze:${userId}`);

    const website = normalizeOptionalUrl(dto.website);
    if (website) {
      await assertPublicUrl(website);
    }

    const sourceUrls: string[] = [];
    for (const url of dto.sourceUrls ?? []) {
      const normalized = normalizeOptionalUrl(url);
      if (normalized) {
        await assertPublicUrl(normalized);
        sourceUrls.push(normalized);
      }
    }

    const cacheKey = `${dto.name.trim().toLowerCase()}|${website ?? ""}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    if (!this.geminiService.isSearchEnabled()) {
      throw new ServiceUnavailableException(
        "Pesquisa de empresas indisponivel. Preencha os dados manualmente.",
      );
    }

    const result = await this.geminiService.researchCompany({
      name: dto.name.trim(),
      website: website ?? undefined,
      sourceUrls,
    });

    this.cache.set(cacheKey, {
      data: result,
      expiresAt: Date.now() + 1000 * 60 * 60,
    });

    return result;
  }

  private ensureAllowed(limiter: InMemoryRateLimiter, key: string) {
    const result = limiter.consume(key);
    if (!result.allowed) {
      throw new BadRequestException(
        "Muitas tentativas. Aguarde um momento e tente novamente.",
      );
    }
  }
}
