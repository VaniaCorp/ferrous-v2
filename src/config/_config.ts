const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions<T = unknown> extends Omit<RequestInit, "body"> {
  body?: T;
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean;
  isMultipart?: boolean;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

function getAuthTokenFromCookies(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((c) => c.startsWith("token="));
    if (tokenCookie) {
      return decodeURIComponent(tokenCookie.split("=")[1]);
    }
  } catch {
    // ignore
  }
  return null;
}

function buildUrl(
  endpoint: string,
  queryParams?: Record<string, string | number | boolean | undefined>
): string {
  let url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;
  if (queryParams && Object.keys(queryParams).length > 0) {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null) params.append(k, String(v));
    });
    url += (url.includes("?") ? "&" : "?") + params.toString();
  }
  return url;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const contentType = response.headers.get("Content-Type");
  let data: T | string | null = null;
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }
  if (!response.ok) {
    throw { response, data };
  }
  return {
    data: data as T,
    status: response.status,
    headers: response.headers,
  };
}

async function apiFetch<T = unknown, B = unknown>(
  endpoint: string,
  method: HttpMethod = "GET",
  options: FetchOptions<B> = {}
): Promise<ApiResponse<T>> {
  const {
    body,
    headers = {},
    queryParams,
    skipAuth = false,
    isMultipart = false,
    ...rest
  } = options;

  const url = buildUrl(endpoint, queryParams);

  const fetchHeaders: Record<string, string> = {
    ...headers,
  };

  // Don't set Content-Type for multipart - browser will set it with boundary
  if (!isMultipart) {
    fetchHeaders["Content-Type"] = "application/json";
  }

  if (!skipAuth) {
    const token = getAuthTokenFromCookies();
    if (token) {
      fetchHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  let fetchBody: BodyInit | undefined;
  if (body !== undefined && body !== null && method !== "GET") {
    if (isMultipart && body instanceof FormData) {
      fetchBody = body;
    } else if (typeof body === "string") {
      fetchBody = body;
    } else {
      fetchBody = JSON.stringify(body);
    }
  }

  const response = await fetch(url, {
    method,
    headers: fetchHeaders,
    body: fetchBody,
    credentials: "same-origin",
    ...rest,
  });
  return handleResponse<T>(response);
}

export default apiFetch;
