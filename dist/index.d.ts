import { TokenXConfig, CoreModule } from './modules/core';
import { UserModule } from './modules/user';
import { NetworkModule } from './modules/network';
import { generateSignature, generateRequestId, getTimestamp } from './auth/signature';
/**
 * TokenX SDK主类
 */
export declare class TokenX {
    core: CoreModule;
    user: UserModule;
    network: NetworkModule;
    /**
     * 创建TokenX SDK实例
     */
    constructor(config: TokenXConfig);
    /**
     * 为了向后兼容保留的方法
     */
    createSignature(): import("./modules/core").SignatureResult;
    /**
     * 为了向后兼容保留的方法
     */
    getUserData(): Promise<import("./modules/user").UserData>;
    /**
     * 为了向后兼容保留的方法
     */
    request(method: 'get' | 'post' | 'put' | 'delete', path: string, data?: any): Promise<any>;
}
export default TokenX;
export { generateSignature, generateRequestId, getTimestamp };
export * from './modules/core';
export * from './modules/user';
export * from './modules/network';
