"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSignature = exports.getTimestamp = exports.generateRequestId = void 0;
const uuid_1 = require("uuid");
const crypto_1 = require("../utils/crypto");
/**
 * 生成请求ID
 * @returns 唯一请求ID
 */
function generateRequestId() {
    return (0, uuid_1.v4)();
}
exports.generateRequestId = generateRequestId;
/**
 * 获取当前时间戳（毫秒）
 * @returns 当前时间戳
 */
function getTimestamp() {
    return Date.now();
}
exports.getTimestamp = getTimestamp;
/**
 * 生成签名
 * @param clientKey 客户端密钥
 * @param clientSecret 客户端密钥
 * @param requestId 请求ID
 * @param timestamp 时间戳
 * @returns 生成的签名
 */
function generateSignature(clientKey, clientSecret, requestId, timestamp) {
    // 第一步：先计算 clientKey 和 requestId 的哈希
    const firstHash = (0, crypto_1.sha256Hash)(`${clientKey}:${requestId}`);
    // 第二步：将第一个哈希与 timestamp 结合计算第二个哈希
    const secondHash = (0, crypto_1.sha256Hash)(`${firstHash}:${timestamp}`);
    // 第三步：最后使用 clientSecret 作为密钥，对第二个哈希进行 HMAC-SHA256 计算
    const signature = (0, crypto_1.hmacSha256)(secondHash, clientSecret);
    return signature;
}
exports.generateSignature = generateSignature;
