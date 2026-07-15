export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiClientOptions = {
  accessToken?: string;
};

export async function apiFetch<TResponse>(
  path: string,
  options: RequestInit & ApiClientOptions = {}
): Promise<TResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new ApiError("NEXT_PUBLIC_API_URL nao configurada", 500);
  }

  const { accessToken, headers, ...requestOptions } = options;
  const response = await fetch(`${baseUrl}${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers
    }
  });

  const contentType = response.headers.get("content-type");
  const body: unknown = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new ApiError("Erro ao comunicar com a API", response.status, body);
  }

  return body as TResponse;
}
