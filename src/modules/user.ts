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
} 