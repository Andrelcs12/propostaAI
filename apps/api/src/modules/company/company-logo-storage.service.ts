import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { BadRequestException, Injectable } from "@nestjs/common";
import type { MultipartFile } from "@fastify/multipart";

const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
]);

const MIME_EXTENSION: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

@Injectable()
export class CompanyLogoStorageService {
  private readonly uploadsRoot = join(process.cwd(), "uploads", "logos");

  async saveLogo(params: {
    userId: string;
    variant: "default" | "light";
    file: MultipartFile;
  }) {
    const { userId, variant, file } = params;

    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException(
        "Formato invalido. Envie PNG, JPG, WEBP ou SVG.",
      );
    }

    const buffer = await file.toBuffer();

    if (buffer.byteLength > MAX_LOGO_SIZE_BYTES) {
      throw new BadRequestException("A logo deve ter no maximo 2 MB.");
    }

    const extension = MIME_EXTENSION[file.mimetype] ?? "png";
    const fileName =
      variant === "light" ? `logo-light.${extension}` : `logo.${extension}`;
    const directory = join(this.uploadsRoot, userId);

    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, fileName), buffer);

    const publicBaseUrl = (
      process.env.API_URL ?? `http://localhost:${process.env.PORT ?? process.env.API_PORT ?? 4000}`
    ).replace(/\/$/, "");

    return {
      url: `${publicBaseUrl}/uploads/logos/${userId}/${fileName}`,
      variant,
    };
  }
}
