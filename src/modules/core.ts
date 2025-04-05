import { generateSignature, generateRequestId, getTimestamp } from '../auth/signature';
import { HttpClient } from '../utils/http';

export interface TokenXConfig {
    clientKey: string;
    clientSecret: string;
    baseUrl?: string;
}

export interface SignatureResult {
    signature: string;
    requestId: string;
    timestamp: number;
}

export class CoreModule {
    protected clientKey: string;
    protected clientSecret: string;
    protected baseUrl: string;
    protected httpClient: HttpClient;

    constructor(config: TokenXConfig) {
        if (!config.clientKey || !config.clientSecret) {
            throw new Error('clientKey and clientSecret are required');
        }

        this.clientKey = config.clientKey;
        this.clientSecret = config.clientSecret;
        this.baseUrl = config.baseUrl || 'https://api.tokenex.pro/api';
        this.httpClient = new HttpClient(this.baseUrl);
    }

    /**
     * 创建签名
     */
    public createSignature(): SignatureResult {
        const requestId = generateRequestId();
        const timestamp = getTimestamp();

        const signature = generateSignature(
            this.clientKey,
            this.clientSecret,
            requestId,
            timestamp
        );

        return {
            signature,
            requestId,
            timestamp
        };
    }

    /**
     * 通用请求方法
     */
    public async request<T = any>(
        method: 'get' | 'post' | 'put' | 'delete',
        path: string,
        data?: any
    ): Promise<T> {
        const auth = this.createSignature();
        return this.httpClient.requestWithAuth<T>(method, path, auth, this.clientKey, data);
    }
} 