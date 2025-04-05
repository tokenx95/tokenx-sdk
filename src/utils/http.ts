import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { SignatureResult } from '../modules/core';

// 添加自定义错误类
export class TokenXApiError extends Error {
    code: number;

    constructor(code: number, message: string) {
        super(message);
        this.code = code;
        this.name = 'TokenXApiError';
    }
}

export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
}

export class HttpClient {
    private client: AxiosInstance;

    constructor(baseUrl: string) {
        this.client = axios.create({
            baseURL: baseUrl,
            timeout: 10000,
        });
    }

    /**
     * 检查API响应状态并处理错误
     */
    private checkResponse<T>(response: ApiResponse<T>): T {
        // 检查API返回的状态码
        if (response.code !== 200) {
            throw new TokenXApiError(response.code, response.message);
        }

        return response.data;
    }

    /**
     * 发送带认证信息的请求
     */
    public async requestWithAuth<T = any>(
        method: 'get' | 'post' | 'put' | 'delete',
        path: string,
        auth: SignatureResult,
        clientKey: string,
        data?: any
    ): Promise<T> {
        const headers = {
            'x-signature': auth.signature,
            'x-timestamp': auth.timestamp.toString(),
            'x-request-id': auth.requestId,
            'x-client-key': clientKey
        };

        const config: AxiosRequestConfig = {
            method,
            url: path,
            headers
        };

        if (data) {
            if (method === 'get') {
                config.params = data;
            } else {
                config.data = data;
            }
        }

        try {
            const response = await this.client.request<ApiResponse<T>>(config);
            // 添加检查API响应状态码
            return this.checkResponse(response.data);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // 处理HTTP错误
                const apiResponse = error.response.data as ApiResponse<any>;
                if (apiResponse && typeof apiResponse.code === 'number') {
                    throw new TokenXApiError(apiResponse.code, apiResponse.message || '请求失败');
                }
                throw new TokenXApiError(error.response.status, `请求失败: ${JSON.stringify(error.response.data)}`);
            }
            // 处理网络错误或其他错误
            throw new TokenXApiError(500, `请求失败: ${error}`);
        }
    }

    /**
     * 发送公共请求（无需认证）
     */
    public async requestPublic<T = any>(
        method: 'get' | 'post' | 'put' | 'delete',
        path: string,
        data?: any
    ): Promise<T> {
        const config: AxiosRequestConfig = {
            method,
            url: path
        };

        if (data) {
            if (method === 'get') {
                config.params = data;
            } else {
                config.data = data;
            }
        }

        try {
            const response = await this.client.request<ApiResponse<T>>(config);
            // 添加检查API响应状态码
            return this.checkResponse(response.data);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // 处理HTTP错误
                const apiResponse = error.response.data as ApiResponse<any>;
                if (apiResponse && typeof apiResponse.code === 'number') {
                    throw new TokenXApiError(apiResponse.code, apiResponse.message || '请求失败');
                }
                throw new TokenXApiError(error.response.status, `请求失败: ${JSON.stringify(error.response.data)}`);
            }
            // 处理网络错误或其他错误
            throw new TokenXApiError(500, `请求失败: ${error}`);
        }
    }
} 