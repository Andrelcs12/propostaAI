import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

type PdfInput = {
  publicToken: string;
  clientName: string;
  title: string;
};

@Injectable()
export class ProposalPdfService {
  private readonly logger = new Logger(ProposalPdfService.name);

  constructor(private readonly configService: ConfigService) {}

  async generate(input: PdfInput): Promise<Buffer> {
    const webUrl =
      this.configService.get<string>("WEB_URL")?.trim() ||
      "http://localhost:3000";
    const renderSecret =
      this.configService.get<string>("PDF_RENDER_SECRET")?.trim() ||
      "dev-render-secret";
    const url = `${webUrl}/p/${input.publicToken}?print=1`;

    try {
      const { chromium } = await import("playwright");
      const browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();

      await page.setExtraHTTPHeaders({
        "X-Render-Secret": renderSecret,
      });

      await page.goto(url, {
        waitUntil: "networkidle",
        timeout: 60_000,
      });

      await page.waitForSelector('[data-proposal-document="ready"]', {
        timeout: 30_000,
      });

      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "12mm",
          bottom: "14mm",
          left: "10mm",
          right: "10mm",
        },
      });

      await browser.close();
      return Buffer.from(pdf);
    } catch (error) {
      this.logger.error("PDF generation failed", error);
      throw new ServiceUnavailableException(
        "Nao foi possivel gerar o PDF. Verifique se o Playwright esta instalado e o app web esta rodando.",
      );
    }
  }

  buildFilename(clientName: string, title: string) {
    const slug = `${clientName}-${title}`
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80)
      .toLowerCase();

    return `proposta-${slug || "comercial"}.pdf`;
  }
}
