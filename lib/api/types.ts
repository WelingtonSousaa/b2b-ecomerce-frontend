/**
 * Common API Response and Request Types
 * Standardized contracts for Frontend <-> Backend communication.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
  errors?: string[];
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ApiErrorDetails {
  message: string;
  statusCode: number;
  code?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  statusCode: number;
  code?: string;
  errors?: Record<string, string[]>;

  constructor({ message, statusCode, code, errors }: ApiErrorDetails) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}
