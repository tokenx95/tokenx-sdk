"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimestamp = exports.generateRequestId = exports.generateSignature = exports.TokenX = void 0;
const axios_1 = __importDefault(require("axios"));
const signature_1 = require("./auth/signature");
Object.defineProperty(exports, "generateSignature", { enumerable: true, get: function () { return signature_1.generateSignature; } });
Object.defineProperty(exports, "generateRequestId", { enumerable: true, get: function () { return signature_1.generateRequestId; } });
Object.defineProperty(exports, "getTimestamp", { enumerable: true, get: function () { return signature_1.getTimestamp; } });
/**
 * TokenX SDK主类
 */
class TokenX {
    /**
     * 创建TokenX SDK实例
     * @param config SDK配置信息
     */
    constructor(config) {
        if (!config.clientKey || !config.clientSecret) {
            throw new Error('clientKey and clientSecret are required');
        }
        this.clientKey = config.clientKey;
        this.clientSecret = config.clientSecret;
        this.baseUrl = config.baseUrl || 'https://api.tokenex.pro/api';
        // 初始化HTTP客户端
        this.httpClient = axios_1.default.create({
            baseURL: this.baseUrl,
            timeout: 10000,
        });
    }
    /**
     * 生成API请求所需的签名
     * @returns 包含签名、请求ID和时间戳的对象
     */
    createSignature() {
        const requestId = (0, signature_1.generateRequestId)();
        const timestamp = (0, signature_1.getTimestamp)();
        const signature = (0, signature_1.generateSignature)(this.clientKey, this.clientSecret, requestId, timestamp);
        return {
            signature,
            requestId,
            timestamp
        };
    }
    /**
     * 获取用户数据
     * @returns 用户数据
     */
    async getUserData() {
        const auth = this.createSignature();
        const headers = {
            'x-signature': auth.signature,
            'x-timestamp': auth.timestamp.toString(),
            'x-request-id': auth.requestId,
            'x-client-key': this.clientKey
        };
        try {
            const response = await this.httpClient.get('/user/overview', { headers });
            return response.data.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                throw new Error(`获取用户数据失败: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            }
            throw new Error(`获取用户数据失败: ${error}`);
        }
    }
    /**
     * 发送带有签名的HTTP请求
     * @param method HTTP方法
     * @param path API路径
     * @param data 请求数据（对于GET请求会转换为查询参数）
     * @returns API响应
     */
    async request(method, path, data) {
        const auth = this.createSignature();
        const headers = {
            'x-signature': auth.signature,
            'x-timestamp': auth.timestamp.toString(),
            'x-request-id': auth.requestId,
            'x-client-key': this.clientKey
        };
        const config = {
            method,
            url: path,
            headers
        };
        if (data) {
            if (method === 'get') {
                config.params = data;
            }
            else {
                config.data = data;
            }
        }
        try {
            const response = await this.httpClient.request(config);
            return response.data.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                throw new Error(`请求失败 ${path}: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            }
            throw new Error(`请求失败 ${path}: ${error}`);
        }
    }
}
exports.TokenX = TokenX;
// 导出主类和相关工具函数
exports.default = TokenX;
