"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hmacSha256 = exports.sha256Hash = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
/**
 * 计算SHA-256哈希值
 * @param input 输入字符串
 * @returns 十六进制格式的哈希结果
 */
function sha256Hash(input) {
    return crypto_js_1.default.SHA256(input).toString(crypto_js_1.default.enc.Hex);
}
exports.sha256Hash = sha256Hash;
/**
 * 计算HMAC-SHA256
 * @param message 消息
 * @param secret 密钥
 * @returns 十六进制格式的HMAC结果
 */
function hmacSha256(message, secret) {
    return crypto_js_1.default.HmacSHA256(message, secret).toString(crypto_js_1.default.enc.Hex);
}
exports.hmacSha256 = hmacSha256;
