import { v4 as uuidv4 } from 'uuid';
import { sha256Hash, hmacSha256 } from '../utils/crypto';

/**
 * 生成请求ID
 * @returns 唯一请求ID
 */
export function generateRequestId(): string {
    return uuidv4();
}

/**
 * 获取当前时间戳（毫秒）
 * @returns 当前时间戳
 */
export function getTimestamp(): number {
    return Date.now();
}

/**
 * 生成签名
 * @param clientKey 客户端密钥
 * @param clientSecret 客户端密钥
 * @param requestId 请求ID
 * @param timestamp 时间戳
 * @returns 生成的签名
 */
export function generateSignature(
    clientKey: string,
    clientSecret: string,
    requestId: string,
    timestamp: number
): string {
    // 第一步：先计算 clientKey 和 requestId 的哈希
    const firstHash = sha256Hash(`${clientKey}:${requestId}`);

    // 第二步：将第一个哈希与 timestamp 结合计算第二个哈希
    const secondHash = sha256Hash(`${firstHash}:${timestamp}`);

    // 第三步：最后使用 clientSecret 作为密钥，对第二个哈希进行 HMAC-SHA256 计算
    const signature = hmacSha256(secondHash, clientSecret);

    return signature;
} 