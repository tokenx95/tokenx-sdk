/**
 * 计算SHA-256哈希值
 * @param input 输入字符串
 * @returns 十六进制格式的哈希结果
 */
export declare function sha256Hash(input: string): string;
/**
 * 计算HMAC-SHA256
 * @param message 消息
 * @param secret 密钥
 * @returns 十六进制格式的HMAC结果
 */
export declare function hmacSha256(message: string, secret: string): string;
