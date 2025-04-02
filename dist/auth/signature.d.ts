/**
 * 生成请求ID
 * @returns 唯一请求ID
 */
export declare function generateRequestId(): string;
/**
 * 获取当前时间戳（毫秒）
 * @returns 当前时间戳
 */
export declare function getTimestamp(): number;
/**
 * 生成签名
 * @param clientKey 客户端密钥
 * @param clientSecret 客户端密钥
 * @param requestId 请求ID
 * @param timestamp 时间戳
 * @returns 生成的签名
 */
export declare function generateSignature(clientKey: string, clientSecret: string, requestId: string, timestamp: number): string;
