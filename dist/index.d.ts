import { generateSignature, generateRequestId, getTimestamp } from './auth/signature';
export interface TokenXConfig {
    clientKey: string;
    clientSecret: string;
}
export interface SignatureResult {
    signature: string;
    requestId: string;
    timestamp: number;
}
/**
 * TokenX SDK主类
 */
export declare class TokenX {
    private clientKey;
    private clientSecret;
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
}
export default TokenX;
export { generateSignature, generateRequestId, getTimestamp };
