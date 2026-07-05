export async function adminFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<{ data?: T; error?: string; status: number }> {
  const isFormData = options?.body instanceof FormData;
  const res = await fetch(url, {
    ...options,
    headers: isFormData
      ? { ...options?.headers }
      : {
          "Content-Type": "application/json",
          ...options?.headers,
        },
  });

  let body: { error?: string } & T = {} as { error?: string } & T;
  try {
    body = await res.json();
  } catch {
    // empty body
  }

  if (!res.ok) {
    return { error: body.error ?? "Request failed", status: res.status };
  }

  return { data: body as T, status: res.status };
}

export function parseJsonField<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
