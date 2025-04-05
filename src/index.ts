import { TokenXConfig, CoreModule } from './modules/core';
import { UserModule } from './modules/user';
import { NetworkModule } from './modules/network';
import { generateSignature, generateRequestId, getTimestamp } from './auth/signature';

/**
 * TokenX SDK主类
 */
export class TokenX {
    public core: CoreModule;
    public user: UserModule;
    public network: NetworkModule;

    /**
     * 创建TokenX SDK实例
     */
    constructor(config: TokenXConfig) {
        this.core = new CoreModule(config);
        this.user = new UserModule(config);
        this.network = new NetworkModule(config);
    }

    /**
     * 为了向后兼容保留的方法
     */
    public createSignature() {
        return this.core.createSignature();
    }

    /**
     * 为了向后兼容保留的方法
     */
    public async getUserData() {
        return this.user.getUserData();
    }

    /**
     * 为了向后兼容保留的方法
     */
    public async request(method: 'get' | 'post' | 'put' | 'delete', path: string, data?: any) {
        return this.core.request(method, path, data);
    }
}

// 导出主类和模块
export default TokenX;
export { generateSignature, generateRequestId, getTimestamp };
export * from './modules/core';
export * from './modules/user';
export * from './modules/network'; 