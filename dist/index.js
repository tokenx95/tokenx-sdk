"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimestamp = exports.generateRequestId = exports.generateSignature = exports.TokenX = void 0;
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
}
exports.TokenX = TokenX;
// 导出主类和相关工具函数
exports.default = TokenX;
