import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { SignatureResult } from '../modules/core';

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
            return response.data.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(`请求失败 ${path}: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            }
            throw new Error(`请求失败 ${path}: ${error}`);
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
            return response.data.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(`请求失败 ${path}: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            }
            throw new Error(`请求失败 ${path}: ${error}`);
        }
    }
} 