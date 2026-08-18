import { ApiError } from './types';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  timeoutMs?: number;
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    // Defaults to relative /api in Next.js, or external backend URL via environment variable
    this.baseUrl = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, '');
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('b2b_auth_token') || sessionStorage.getItem('b2b_auth_token');
    }
    return null;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // If endpoint is a full external URL, use it directly
    const url = endpoint.startsWith('http://') || endpoint.startsWith('https://')
      ? new URL(endpoint)
      : new URL(`${this.baseUrl}${cleanEndpoint}`, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  async request<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
      body,
      params,
      headers = {},
      timeoutMs = 15000,
      token,
      ...customConfig
    } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const authToken = token || this.getAuthToken();

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(headers as Record<string, string>),
    };

    const config: RequestInit = {
      ...customConfig,
      headers: requestHeaders,
      signal: controller.signal,
    };

    if (body !== undefined) {
      config.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const url = this.buildUrl(endpoint, params);

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      let responseData: Record<string, unknown> | string | null = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = (await response.json()) as Record<string, unknown>;
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        const errorObj = typeof responseData === 'object' && responseData !== null ? responseData : {};
        throw new ApiError({
          message: (errorObj.message as string) || (errorObj.error as string) || `HTTP error ${response.status}: ${response.statusText}`,
          statusCode: response.status,
          code: errorObj.code as string | undefined,
          errors: errorObj.errors as Record<string, string[]> | undefined,
        });
      }

      // If backend returns { success: true, data: ... }, extract or return raw
      return responseData as T;
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError({
          message: `Tempo limite de requisição excedido (${timeoutMs}ms). Verifique a conexão com o servidor.`,
          statusCode: 408,
          code: 'TIMEOUT',
        });
      }

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError({
        message: error instanceof Error ? error.message : 'Erro de conexão inesperado com a API.',
        statusCode: 500,
        code: 'NETWORK_ERROR',
      });
    }
  }

  // Convenience methods
  get<T = unknown>(endpoint: string, options?: Omit<RequestOptions, 'body' | 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body' | 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  put<T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body' | 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  patch<T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body' | 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  delete<T = unknown>(endpoint: string, options?: Omit<RequestOptions, 'body' | 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
