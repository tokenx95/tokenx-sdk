"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenXApiError = exports.getTimestamp = exports.generateRequestId = exports.generateSignature = exports.TokenX = void 0;
const core_1 = require("./modules/core");
const user_1 = require("./modules/user");
const network_1 = require("./modules/network");
const signature_1 = require("./auth/signature");
Object.defineProperty(exports, "generateSignature", { enumerable: true, get: function () { return signature_1.generateSignature; } });
Object.defineProperty(exports, "generateRequestId", { enumerable: true, get: function () { return signature_1.generateRequestId; } });
Object.defineProperty(exports, "getTimestamp", { enumerable: true, get: function () { return signature_1.getTimestamp; } });
const http_1 = require("./utils/http");
Object.defineProperty(exports, "TokenXApiError", { enumerable: true, get: function () { return http_1.TokenXApiError; } });
/**
 * TokenX SDK主类
 */
class TokenX {
    /**
     * 创建TokenX SDK实例
     */
    constructor(config) {
        this.core = new core_1.CoreModule(config);
        this.user = new user_1.UserModule(config);
        this.network = new network_1.NetworkModule(config);
    }
    /**
     * 为了向后兼容保留的方法
     */
    createSignature() {
        return this.core.createSignature();
    }
    /**
     * 为了向后兼容保留的方法
     */
    async getUserData() {
        return this.user.getUserData();
    }
    /**
     * 为了向后兼容保留的方法
     */
    async request(method, path, data) {
        return this.core.request(method, path, data);
    }
}
exports.TokenX = TokenX;
// 导出主类和模块
exports.default = TokenX;
__exportStar(require("./modules/core"), exports);
__exportStar(require("./modules/user"), exports);
__exportStar(require("./modules/network"), exports);
