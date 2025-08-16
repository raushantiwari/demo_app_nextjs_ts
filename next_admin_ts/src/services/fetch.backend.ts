'use server';
import { BASE_URL } from '@/utils/backend.constant';

export type FetchOptions = RequestInit & {
  interceptRequest?: (options: RequestInit) => RequestInit;
  interceptResponse?: (response: Response) => Promise<Response>;
  token?: string; // Optional token field
  isMultipart?: boolean; // Flag to determine multipart/form-data
};

export async function ttnFetch(
  url: string,
  options: FetchOptions = {},
): Promise<Response> {
  // Add Next.js revalidate
  if (options?.next === undefined) {
    options = { ...options, next: { revalidate: 0 } }; // 5 minuts
  }
  // Ensure the headers object exists and set the "Content-Type" and "Authorization"
  const headers: Record<string, string> = {
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    ...(options.headers ? (options.headers as Record<string, string>) : {}),
  };

  // If it's not multipart, ensure 'Content-Type' is set to 'application/json'
  if (!options.isMultipart && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';

    // Ensure body is JSON stringified if not multipart
    if (options.body && typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    }
  }

  // Clone the options and include the headers
  let requestOptions: RequestInit = { ...options, headers };

  // Apply request interceptor if provided
  if (options.interceptRequest) {
    requestOptions = options.interceptRequest(requestOptions);
  }

  const urlInfo = `${BASE_URL}${url}`;

  console.log(urlInfo, 'requestOptions');
  const response = await fetch(urlInfo, requestOptions);
  // Apply response interceptor if provided

  if (options.interceptResponse) {
    return options.interceptResponse(response);
  }

  return response;
}
