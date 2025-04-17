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

// 充值记录查询参数接口
export interface DepositRecordsQueryParams {
    status?: 1 | 2;             // 充值状态: 1=充值中, 2=已完成
    depositType?: 1 | 2;        // 充值类型: 1=账户充值, 2=子钱包充值
    startTime?: string;         // 开始时间
    endTime?: string;           // 结束时间
    token?: string;             // 代币符号
    address?: string;           // 地址或交易哈希
    page?: number;              // 页码
    pageSize?: number;          // 每页数量
}

// 充值记录项接口
export interface DepositRecordItem {
    depositType: number;
    typeName: string;
    chain: string;
    sender: string;
    receiver: string;
    amount: string;
    token: string;
    blockNumber: number;
    status: number;
    statusText: string;
    address: string;
    txHash: string;
    confirmations: number;
    requiredConfirmations: number;
    txLink: string;
    createdAt: string;
    processedAt: string;
}

// 分页信息接口
export interface PaginationInfo {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// 充值记录响应接口
export interface DepositRecordsResponse {
    records: DepositRecordItem[];
    pagination: PaginationInfo;
}

// 更新提现记录查询参数接口
export interface WithdrawalRecordsQueryParams {
    withdrawType?: 1 | 2;      // 提现类型: 1=账户钱包, 2=子钱包
    status?: 0 | 1 | 2 | 3;     // 状态: 0=处理中, 1=已处理, 2=已拒绝, 3=大额待审核
    tokenName?: string;         // 代币名称，如USDT
    address?: string;           // 地址或交易哈希
    startTime?: string;         // 开始时间
    endTime?: string;           // 结束时间
    page?: number;              // 页码
    pageSize?: number;          // 每页数量
}

// 代币信息接口
export interface WithdrawalTokenInfo {
    name: string;
    contractAddress: string;
    decimals: number;
    logo: string;
}

// 链信息接口
export interface WithdrawalChainInfo {
    name: string;
    logo: string;
    explorerUrl?: string;
}

// 交易信息接口
export interface WithdrawalTransactionInfo {
    hash: string;
    blockNumber: number;
    confirmations: number;
}

// 手续费信息接口
export interface WithdrawalFeeInfo {
    amount: string;
    token: string;
}

// 提现记录项接口
export interface WithdrawalRecordItem {
    _id: string;
    withdrawId: string;
    userId: string;
    type: number;
    amount: string;
    toAddress: string;
    status: number;
    statusText: string;
    createdAt: string;
    updatedAt: string;
    txLink: string;
    token: WithdrawalTokenInfo;
    chain: WithdrawalChainInfo;
    fee: WithdrawalFeeInfo;
    transaction?: WithdrawalTransactionInfo;
}

// 提现分页信息接口
export interface WithdrawalPaginationInfo {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

// 提现记录响应接口
export interface WithdrawalRecordsResponse {
    withdrawals: WithdrawalRecordItem[];
    pagination: WithdrawalPaginationInfo;
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

    /**
     * 获取充值记录
     * @param params 查询参数
     * @returns 充值记录及分页信息
     */
    public async getDepositRecords(params?: DepositRecordsQueryParams): Promise<DepositRecordsResponse> {
        // 设置默认值
        const queryParams: DepositRecordsQueryParams = {
            page: params?.page || 1,
            pageSize: params?.pageSize || 10,
            ...params
        };

        return this.request<DepositRecordsResponse>('get', '/user/deposit-records', queryParams);
    }

    /**
     * 根据充值类型查询充值记录
     * @param depositType 充值类型: 1=账户充值, 2=子钱包充值
     * @param page 页码
     * @param pageSize 每页数量
     * @returns 充值记录及分页信息
     */
    public async getDepositRecordsByType(
        depositType: 1 | 2,
        page: number = 1,
        pageSize: number = 10
    ): Promise<DepositRecordsResponse> {
        return this.getDepositRecords({
            depositType,
            page,
            pageSize
        });
    }

    /**
     * 根据时间范围查询充值记录
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param page 页码
     * @param pageSize 每页数量
     * @returns 充值记录及分页信息
     */
    public async getDepositRecordsByTimeRange(
        startTime: string,
        endTime: string,
        page: number = 1,
        pageSize: number = 10
    ): Promise<DepositRecordsResponse> {
        return this.getDepositRecords({
            startTime,
            endTime,
            page,
            pageSize
        });
    }

    /**
     * 根据代币符号查询充值记录
     * @param token 代币符号
     * @param page 页码
     * @param pageSize 每页数量
     * @returns 充值记录及分页信息
     */
    public async getDepositRecordsByToken(
        token: string,
        page: number = 1,
        pageSize: number = 10
    ): Promise<DepositRecordsResponse> {
        return this.getDepositRecords({
            token,
            page,
            pageSize
        });
    }

    /**
     * 根据地址或交易哈希查询充值记录
     * @param addressOrHash 地址或交易哈希
     * @param page 页码
     * @param pageSize 每页数量
     * @returns 充值记录及分页信息
     */
    public async getDepositRecordsByAddressOrHash(
        addressOrHash: string,
        page: number = 1,
        pageSize: number = 10
    ): Promise<DepositRecordsResponse> {
        return this.getDepositRecords({
            address: addressOrHash,
            page,
            pageSize
        });
    }

    /**
     * 获取提现记录
     * @param params 查询参数
     * @returns 提现记录及分页信息
     */
    public async getWithdrawalRecords(params?: WithdrawalRecordsQueryParams): Promise<WithdrawalRecordsResponse> {
        // 设置默认值
        const queryParams: WithdrawalRecordsQueryParams = {
            page: params?.page || 1,
            pageSize: params?.pageSize || 10,
            ...params
        };

        return this.request<WithdrawalRecordsResponse>('get', '/user/withdrawal/records', queryParams);
    }

    /**
     * 根据提现类型查询提现记录
     * @param withdrawType 提现类型: 1=账户钱包, 2=子钱包
     * @param page 页码
     * @param pageSize 每页数量
     * @returns 提现记录及分页信息
     */
    public async getWithdrawalRecordsByType(
        withdrawType: 1 | 2,
        page: number = 1,
        pageSize: number = 10
    ): Promise<WithdrawalRecordsResponse> {
        return this.getWithdrawalRecords({
            withdrawType,
            page,
            pageSize
        });
    }

    /**
     * 根据状态查询提现记录
     * @param status 状态: 0=处理中, 1=已处理, 2=已拒绝, 3=大额待审核
     * @param page 页码
     * @param pageSize 每页数量
     * @returns 提现记录及分页信息
     */
    public async getWithdrawalRecordsByStatus(
        status: 0 | 1 | 2 | 3,
        page: number = 1,
        pageSize: number = 10
    ): Promise<WithdrawalRecordsResponse> {
        return this.getWithdrawalRecords({
            status,
            page,
            pageSize
        });
    }

    /**
     * 根据代币名称查询提现记录
     * @param tokenName 代币名称，如USDT
     * @param page 页码
     * @param pageSize 每页数量
     * @returns 提现记录及分页信息
     */
    public async getWithdrawalRecordsByToken(
        tokenName: string,
        page: number = 1,
        pageSize: number = 10
    ): Promise<WithdrawalRecordsResponse> {
        return this.getWithdrawalRecords({
            tokenName,
            page,
            pageSize
        });
    }

    /**
     * 根据地址或交易哈希查询提现记录
     * @param addressOrHash 地址或交易哈希
     * @param page 页码
     * @param pageSize 每页数量
     * @returns 提现记录及分页信息
     */
    public async getWithdrawalRecordsByAddressOrHash(
        addressOrHash: string,
        page: number = 1,
        pageSize: number = 10
    ): Promise<WithdrawalRecordsResponse> {
        return this.getWithdrawalRecords({
            address: addressOrHash,
            page,
            pageSize
        });
    }

    /**
     * 根据时间范围查询提现记录
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param page 页码
     * @param pageSize 每页数量
     * @returns 提现记录及分页信息
     */
    public async getWithdrawalRecordsByTimeRange(
        startTime: string,
        endTime: string,
        page: number = 1,
        pageSize: number = 10
    ): Promise<WithdrawalRecordsResponse> {
        return this.getWithdrawalRecords({
            startTime,
            endTime,
            page,
            pageSize
        });
    }
} 