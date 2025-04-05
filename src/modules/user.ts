import { CoreModule } from './core';

export interface UserData {
    basic: {
        uid: string;
        email: string;
        avatar: string;
        nickname: string;
        bio: string;
        bindWalletAddress: string;
        bindSocialAccounts: {
            google: { connected: boolean };
            discord?: {
                id: string;
                username: string;
                discriminator: string;
                avatar: string;
                tokenExpiry: string;
                connected: boolean;
            };
            twitter?: {
                id: string;
                username: string;
                name: string;
                profileImage: string;
                tokenExpiry: string;
                connected: boolean;
            };
            github?: {
                id: string;
                username: string;
                name: string;
                connected: boolean;
            };
        };
        createdAt: string;
    };
    wallet: {
        accountEvmAddresses: string[];
        accountBalance: string;
        accountTokenBalance: Record<string, string>;
    };
    subWallets: {
        freeAddressesLeft: number;
        callbackPrimaryUrl: string;
        callbackBackupUrl1: string;
        callbackBackupUrl2: string;
        callbackKey: string;
    };
    stats: {
        subEvmAddressNumber: number;
    };
    settings: {
        twoFA: boolean;
        antiPhishing: boolean;
    };
    apiKeys: {
        hasApiKey: boolean;
    };
}

export interface SubWalletInfo {
    address: string;
    applyTime: string;
}

export interface SubWalletsResponse {
    totalNumber: number;
    page: number;
    pageSize: number;
    subWallets: SubWalletInfo[];
}

// 添加钱包地址分配响应接口
export interface AllocateAddressResponse {
    newEvmAddress: string;
    totalEvmAddresses: string[];
}

// 回调URL设置请求参数接口
export interface SetCallbackUrlsParams {
    primaryUrl: string;      // 主回调URL（必需）
    backupUrl1?: string;     // 备用回调URL 1（可选）
    backupUrl2?: string;     // 备用回调URL 2（可选）
}

// 回调URL设置响应接口
export interface CallbackUrlsResponse {
    callbackUrl: {
        primaryUrl: string;
        backupUrl1: string;
        backupUrl2: string;
    }
}

// 回调密钥设置请求参数接口
export interface SetCallbackKeyParams {
    callbackKey: string;     // 回调密钥
}

// 回调密钥设置响应接口
export interface CallbackKeyResponse {
    callbackKey: string;     // 可能部分隐藏的回调密钥
}

// 分配子钱包地址响应接口
export interface AllocateSubWalletResponse {
    address: string[];
}

export class UserModule extends CoreModule {
    /**
     * 获取用户信息
     */
    public async getUserData(): Promise<UserData> {
        return this.request<UserData>('get', '/user/overview');
    }

    /**
     * 获取用户子钱包地址列表
     * @param options 分页选项
     * @returns 子钱包列表数据
     */
    public async getSubWallets(options?: { page?: number; pageSize?: number }): Promise<SubWalletsResponse> {
        // 设置默认值
        const page = options?.page || 1;
        const pageSize = options?.pageSize || 10;

        // 构建查询参数
        const params = {
            page,
            pageSize
        };

        // 发送请求
        return this.request<SubWalletsResponse>('get', '/user/sub-wallets', params);
    }

    /**
     * 获取用户的所有子钱包地址（自动处理分页）
     * @returns 所有子钱包地址数组
     */
    public async getAllSubWalletAddresses(): Promise<string[]> {
        // 首先获取第一页，了解总数
        const firstPage = await this.getSubWallets({ page: 1, pageSize: 100 });
        const addresses: string[] = firstPage.subWallets.map(wallet => wallet.address);

        // 如果有更多页，继续获取
        const totalPages = Math.ceil(firstPage.totalNumber / 100);

        for (let page = 2; page <= totalPages; page++) {
            const nextPage = await this.getSubWallets({ page, pageSize: 100 });
            addresses.push(...nextPage.subWallets.map(wallet => wallet.address));
        }

        return addresses;
    }

    /**
     * 分配新的账户钱包地址
     * @returns 分配结果，包含新地址和所有地址列表
     */
    public async allocateAccountWalletAddress(): Promise<AllocateAddressResponse> {
        return this.request<AllocateAddressResponse>('post', '/user/wallet/allocate-address');
    }

    /**
     * 分配新的账户钱包地址并只返回新地址
     * @returns 仅返回新分配的钱包地址
     */
    public async allocateAccountWalletAddressSimple(): Promise<string> {
        const result = await this.allocateAccountWalletAddress();
        return result.newEvmAddress;
    }

    /**
     * 设置子钱包回调URL
     * @param params 回调URL参数
     * @returns 设置后的回调URL信息
     */
    public async setSubWalletCallbackUrls(params: SetCallbackUrlsParams): Promise<CallbackUrlsResponse> {
        if (!params.primaryUrl) {
            throw new Error('主回调URL (primaryUrl) 是必需的且不能为空');
        }

        const data: SetCallbackUrlsParams = {
            primaryUrl: params.primaryUrl,
            ...(params.backupUrl1 !== undefined && { backupUrl1: params.backupUrl1 }),
            ...(params.backupUrl2 !== undefined && { backupUrl2: params.backupUrl2 })
        };
        return this.request<CallbackUrlsResponse>('post', '/user/sub-wallets/callback-url', data);
    }

    /**
     * 设置子钱包回调密钥
     * @param callbackKey 回调密钥
     * @returns 设置后的回调密钥信息
     */
    public async setSubWalletCallbackKey(callbackKey: string): Promise<CallbackKeyResponse> {
        if (!callbackKey) {
            throw new Error('回调密钥 (callbackKey) 不能为空');
        }
        return this.request<CallbackKeyResponse>('post', '/user/sub-wallets/callback-key', { callbackKey });
    }

    /**
     * 免费分配子钱包地址
     * @param number 免费分配的地址数量
     * @returns 分配的地址列表
     */
    public async allocateFreeSubWallets(number: number): Promise<AllocateSubWalletResponse> {
        if (!number || number <= 0) {
            throw new Error('分配数量必须大于0');
        }

        return this.request<AllocateSubWalletResponse>('post', '/user/sub-wallets/allocate', {
            number
        });
    }

    /**
     * 付费购买子钱包地址
     * @param buyNumber 购买的地址数量
     * @returns 分配的地址列表
     */
    public async purchaseSubWallets(buyNumber: number | string): Promise<AllocateSubWalletResponse> {
        const numberToBuy = typeof buyNumber === 'string' ? parseInt(buyNumber, 10) : buyNumber;

        if (isNaN(numberToBuy) || numberToBuy <= 0) {
            throw new Error('购买数量必须大于0');
        }

        return this.request<AllocateSubWalletResponse>('post', '/user/sub-wallets/allocate', {
            buy: 1,
            buyNumber: buyNumber
        });
    }

    /**
     * 分配单个子钱包地址的便捷方法（免费）
     * @returns 分配的单个地址
     */
    public async allocateSingleFreeSubWallet(): Promise<string> {
        const result = await this.allocateFreeSubWallets(1);
        return result.address[0];
    }

    /**
     * 购买单个子钱包地址的便捷方法
     * @returns 购买的单个地址
     */
    public async purchaseSingleSubWallet(): Promise<string> {
        const result = await this.purchaseSubWallets(1);
        return result.address[0];
    }
} 