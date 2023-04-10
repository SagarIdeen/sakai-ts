import axios, { AxiosResponse } from "axios";

/**
 * ApiResponse interface to define the structure of API responses.
 */
interface ApiResponse<T> {
  data: T | null;
  error?: {
    message?: string;
    status?: number;
    errorMessage?: string;
  };
}

let authToken: string | null = null;

/**
 * Create an axios instance for making API calls.
 */
const http = axios.create({
  baseURL: "http://localhost:3000/v1",
});

/**
 * Set the initial authorization header for the axios instance.
 *
 * This ensures that the Authorization header is explicitly set when the axios
 * instance is created. If an authToken is available, the header is set with
 * the correct value. If not, it's set to an empty string.
 *
 * Note that subsequent updates to the authToken should be done using the
 * setAuthToken method.
 */
http.defaults.headers.common["Authorization"] = authToken
  ? `Bearer ${authToken}`
  : "";

/**
 * Handle API response and errors.
 */
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message ?? error.message;
    const errorMessage = getErrorMessage(status);
    return Promise.reject({ message, status, errorMessage });
  }
);

/**
 * Get an error message based on the HTTP status code.
 *
 * @param status - HTTP status code
 * @returns A string containing the error message.
 */
function getErrorMessage(status: number | undefined): string {
  switch (status) {
    case 400:
      return "Bad Request";
    case 401:
      return "Unauthorized";
    case 403:
      return "Forbidden";
    case 404:
      return "Not Found";
    case 500:
      return "Internal Server Error";
    default:
      return "Error";
  }
}

/**
 * ApiService object containing methods for making API calls.
 */
export const HttpService = {
  http,

  /**
   * Set the authorization token for the API.
   *
   * @param token - The authorization token string
   */
  setAuthToken(token: string | null) {
    authToken = token;
    http.defaults.headers.common["Authorization"] = token
      ? `Bearer ${token}`
      : "";
  },

  /**
   * Make an API request.
   *
   * @param method - HTTP method to use for the request
   * @param url - The API endpoint URL
   * @param data - Optional data to be sent with the request
   * @returns A Promise that resolves to an ApiResponse object
   */
  async request<T>(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await http[method](url, data);
      return { data: response.data };
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message ?? error.message;
      const errorMessage = getErrorMessage(status);
      return { data: null, error: { message, status, errorMessage } };
    }
  },

  /**
   * Send a GET request to the specified URL.
   *
   * @param url - The API endpoint URL
   * @returns A Promise that resolves to an ApiResponse object
   */
  get<T>(url: string): Promise<ApiResponse<T>> {
    return this.request("get", url);
  },

  /**
   * Send a POST request to the specified URL with the provided data.
   *
   * @param url - The API endpoint URL
   * @param data - Data to be sent with the request
   * @returns A Promise that resolves to an ApiResponse object
   */
  post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request("post", url, data);
  },
  /**
   * Send a PUT request to the specified URL with the provided data.
   *
   * @param url - The API endpoint URL
   * @param data - Data to be sent with the request
   * @returns A Promise that resolves to an ApiResponse object
   */
  put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request("put", url, data);
  },

  /**
   * Send a PATCH request to the specified URL with the provided data.
   *
   * @param url - The API endpoint URL
   * @param data - Data to be sent with the request
   * @returns A Promise that resolves to an ApiResponse object
   */
  patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request("patch", url, data);
  },

  /**
   * Send a DELETE request to the specified URL.
   *
   * @param url - The API endpoint URL
   * @returns A Promise that resolves to an ApiResponse object
   */
  delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request("delete", url);
  },
};
