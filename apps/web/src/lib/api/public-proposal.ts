import { ApiError } from "@/lib/api/client";
import type { PublicProposal } from "@/features/proposals/types/proposal";

type FetchPublicProposalOptions = {
  print?: boolean;
};

export async function fetchPublicProposal(
  token: string,
  options: FetchPublicProposalOptions = {},
): Promise<PublicProposal> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new ApiError("NEXT_PUBLIC_API_URL nao configurada", 500);
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (options.print && process.env.PDF_RENDER_SECRET) {
    headers["X-Render-Secret"] = process.env.PDF_RENDER_SECRET;
  }

  const query = options.print ? "?print=1" : "";
  const response = await fetch(
    `${baseUrl}/api/proposals/public/${token}${query}`,
    {
      headers,
      cache: "no-store",
    },
  );

  const contentType = response.headers.get("content-type");
  const body: unknown = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const record =
      typeof body === "object" && body !== null
        ? (body as Record<string, unknown>)
        : null;
    throw new ApiError(
      typeof record?.message === "string"
        ? record.message
        : "Proposta nao encontrada.",
      response.status,
    );
  }

  return body as PublicProposal;
}

export function buildShareUrl(publicToken: string) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";
  return `${appUrl}/p/${publicToken}`;
}
