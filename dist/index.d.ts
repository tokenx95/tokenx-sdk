import { generateSignature, generateRequestId, getTimestamp } from './auth/signature';
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
export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
}
export interface UserData {
    basic: {
        uid: string;
        email: string;
        avatar: string;
        nickname: string;
        bio: string;
        bindWalletAddress: string;
        bindSocialAccounts: {
            google: {
                connected: boolean;
            };
            discord?: {
                id: string;
                username: string;
                discriminator: string;
                avatar: string;
                tokenExpiry: string;
                connected: boolean;
            };
            twitter?: {
                id: string;
                username: string;
                name: string;
                profileImage: string;
                tokenExpiry: string;
                connected: boolean;
            };
            github?: {
                id: string;
                username: string;
                name: string;
                connected: boolean;
            };
        };
        createdAt: string;
    };
    wallet: {
        accountEvmAddresses: string[];
        accountBalance: string;
        accountTokenBalance: Record<string, string>;
    };
    subWallets: {
        freeAddressesLeft: number;
        callbackPrimaryUrl: string;
        callbackBackupUrl1: string;
        callbackBackupUrl2: string;
        callbackKey: string;
    };
    stats: {
        subEvmAddressNumber: number;
    };
    settings: {
        twoFA: boolean;
        antiPhishing: boolean;
    };
    apiKeys: {
        hasApiKey: boolean;
    };
}
/**
 * TokenX SDK主类
 */
export declare class TokenX {
    private clientKey;
    private clientSecret;
    private baseUrl;
    private httpClient;
    /**
     * 创建TokenX SDK实例
     * @param config SDK配置信息
     */
    constructor(config: TokenXConfig);
    /**
     * 生成API请求所需的签名
     * @returns 包含签名、请求ID和时间戳的对象
     */
    createSignature(): SignatureResult;
    /**
     * 获取用户数据
     * @returns 用户数据
     */
    getUserData(): Promise<UserData>;
    /**
     * 发送带有签名的HTTP请求
     * @param method HTTP方法
     * @param path API路径
     * @param data 请求数据（对于GET请求会转换为查询参数）
     * @returns API响应
     */
    request<T = any>(method: 'get' | 'post' | 'put' | 'delete', path: string, data?: any): Promise<T>;
}
export default TokenX;
export { generateSignature, generateRequestId, getTimestamp };
