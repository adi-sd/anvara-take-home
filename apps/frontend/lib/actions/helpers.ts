import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { cookies } from 'next/headers';
import { ApiError } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

// Create authenticated axios instance for server-side use
export async function createAuthenticatedAxios() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    validateStatus: () => true,
  });
}

// Helper function to make authenticated requests with proper typing
export async function authenticatedRequest<TResponse, TData = unknown>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  endpoint: string,
  data?: TData,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const axiosInstance = await createAuthenticatedAxios();

  const response: AxiosResponse<TResponse | ApiError> = await axiosInstance.request({
    method,
    url: endpoint,
    data,
    ...config,
  });

  // Handle errors
  if (response.status >= 400) {
    const errorData = response.data as ApiError;
    const errorMessage =
      errorData.message || errorData.error || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.data as TResponse;
}
