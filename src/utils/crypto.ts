import CryptoJS from 'crypto-js';

/**
 * 计算SHA-256哈希值
 * @param input 输入字符串
 * @returns 十六进制格式的哈希结果
 */
export function sha256Hash(input: string): string {
    return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
}

/**
 * 计算HMAC-SHA256
 * @param message 消息
 * @param secret 密钥
 * @returns 十六进制格式的HMAC结果
 */
export function hmacSha256(message: string, secret: string): string {
    return CryptoJS.HmacSHA256(message, secret).toString(CryptoJS.enc.Hex);
} 