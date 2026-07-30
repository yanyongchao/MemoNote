import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { TOKEN_KEY } from '@/constants/auth';
import { toast } from './toast';
import { storage } from './storage';

// ==================== 类型定义 ====================

/** 后端统一响应格式 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  success: boolean;
  timestamp: number;
}

/** 业务错误（code !== 200） */
export class ApiError extends Error {
  code: number;
  timestamp: number;

  constructor(response: ApiResponse) {
    super(response.message);
    this.name = 'ApiError';
    this.code = response.code;
    this.timestamp = response.timestamp;
  }
}

// ==================== 取消重复请求 ====================

const pendingMap = new Map<string, AbortController>();

function getRequestKey(config: AxiosRequestConfig): string {
  return [config.method, config.url, JSON.stringify(config.params), JSON.stringify(config.data)].join('&');
}

function addPending(config: InternalAxiosRequestConfig) {
  const key = getRequestKey(config);
  // 取消前一个相同请求
  if (pendingMap.has(key)) {
    pendingMap.get(key)!.abort();
    pendingMap.delete(key);
  }
  const controller = new AbortController();
  config.signal = controller.signal;
  pendingMap.set(key, controller);
}

function removePending(config: AxiosRequestConfig) {
  const key = getRequestKey(config);
  pendingMap.delete(key);
}

// ==================== 统一错误提示 ====================

function showError(message: string) {
  toast.error(message);
}

// ==================== 实例 ====================
const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || '',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ==================== 拦截器 ====================

/** 请求拦截：注入 token + 取消重复请求 */
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  addPending(config);

  const token = storage.getItem<string>(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** 响应拦截：解包 data、统一错误处理 */
instance.interceptors.response.use(
  (response) => {
    removePending(response.config);
    const body = response.data as ApiResponse;

    if (!body.success) {
      showError(body.message);
      return Promise.reject(new ApiError(body));
    }

    // 需要返回 headers 的场景（如提取 cookie）
    if ((response.config as any).__returnHeaders) {
      return { data: body.data, headers: response.headers } as any;
    }

    return body.data as any;
  },
  (error: AxiosError<ApiResponse>) => {
    if (error.config) removePending(error.config);

    // 被取消的请求不提示
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // 401 → 清除 token
    if (error.response?.status === 401) {
      storage.removeItem(TOKEN_KEY);
      showError('登录已过期，请重新登录');
      return Promise.reject(error);
    }

    // 服务端返回了业务格式的错误
    if (error.response?.data?.code) {
      const apiError = new ApiError(error.response.data);
      showError(apiError.message);
      return Promise.reject(apiError);
    }

    // 网络错误 / 超时
    if (error.code === 'ECONNABORTED') {
      showError('请求超时，请稍后重试');
    } else if (!error.response) {
      showError('网络异常，请检查网络连接');
    } else {
      showError(`服务器错误 (${error.response.status})`);
    }

    return Promise.reject(error);
  },
);

// ==================== 请求方法 ====================

/** GET 请求 */
function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return instance.get(url, config) as Promise<T>;
}

/** POST 请求 */
function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return instance.post(url, data, config) as Promise<T>;
}

/** POST 请求 — 返回 { data, headers }，用于需要读取响应头的场景（如提取 cookie） */
async function postWithHeaders<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<{ data: T; headers: Record<string, string> }> {
  const response = await instance.post(url, data, { ...config, __returnHeaders: true } as any);
  return response as any;
}

/** PUT 请求 */
function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return instance.put(url, data, config) as Promise<T>;
}

/** DELETE 请求 */
function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return instance.delete(url, config) as Promise<T>;
}

/** PATCH 请求 */
function patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return instance.patch(url, data, config) as Promise<T>;
}

export const http = { get, post, postWithHeaders, put, del, patch, instance };
