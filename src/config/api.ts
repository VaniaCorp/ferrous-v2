import apiFetch from "@/config/_config";

type QueryParams = Record<string, string | number | boolean | undefined>;

export const fetchData = async <T = unknown>(
  endpoint: string,
  queryParams?: QueryParams,
  options: { headers?: Record<string, string> } = {}
): Promise<T> => {
  const response = await apiFetch<T>(endpoint, "GET", {
    queryParams,
    ...options,
  });
  return response.data;
};

export const postData = async <T = unknown, B = unknown>(
  endpoint: string,
  data?: B,
  options: { headers?: Record<string, string>; isMultipart?: boolean } = {}
): Promise<T> => {
  const response = await apiFetch<T, B>(endpoint, "POST", {
    body: data,
    ...options,
  });
  return response.data;
};

export const updateData = async <T = unknown, B = unknown>(
  endpoint: string,
  data?: B,
  options: { headers?: Record<string, string>; isMultipart?: boolean } = {}
): Promise<T> => {
  const response = await apiFetch<T, B>(endpoint, "PUT", {
    body: data,
    ...options,
  });
  return response.data;
};

export const patchData = async <T = unknown, B = unknown>(
  endpoint: string,
  data?: B,
  options: { headers?: Record<string, string>; isMultipart?: boolean } = {}
): Promise<T> => {
  const response = await apiFetch<T, B>(endpoint, "PATCH", {
    body: data,
    ...options,
  });
  return response.data;
};

export const deleteData = async <T = unknown>(
  endpoint: string,
  options: { headers?: Record<string, string> } = {}
): Promise<T> => {
  const response = await apiFetch<T>(endpoint, "DELETE", { ...options });
  return response.data;
};
