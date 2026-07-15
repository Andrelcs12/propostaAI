export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details?: unknown,
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
  options: RequestInit & ApiClientOptions = {},
): Promise<TResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new ApiError("NEXT_PUBLIC_API_URL nao configurada", 500);
  }

  const { accessToken, headers, ...requestOptions } = options;
  const endpoint = `${baseUrl}${path}`;
  const response = await fetch(endpoint, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });

  const contentType = response.headers.get("content-type");
  const body: unknown = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new ApiError(
      getApiErrorMessage(body, response.status, path),
      response.status,
      {
        endpoint: path,
        body,
      },
    );
  }

  return body as TResponse;
}

function getApiErrorMessage(body: unknown, status: number, path: string) {
  const fallback = `Erro na API (${status}) em ${path}`;

  if (typeof body === "object" && body && "message" in body) {
    const message = (body as { message?: unknown }).message;

    if (Array.isArray(message)) {
      return message.join(" ");
    }

    if (typeof message === "string") {
      return message;
    }
  }

  if (typeof body === "string" && body.trim()) {
    return body;
  }

  return fallback;
}
