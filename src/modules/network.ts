import { CoreModule } from './core';
import { HttpClient } from '../utils/http';

// 更新TokenNetwork接口，确保与API返回结构匹配
export interface TokenNetwork {
    id: string;            // 网络ID
    name: string;          // 网络简称
    fullName: string;      // 网络全称
    logo: string;          // 网络logo
    contractAddress: string; // 合约地址
    decimals: number;      // 小数位数
    confirmations?: number;  // 确认数
    nativeCurrency?: {      // 原生货币信息
        symbol: string;     // 原生货币符号
        decimals: number;   // 原生货币小数位数
    };
}

// 代币信息接口
export interface TokenInfo {
    symbol: string;        // 代币符号
    isStable: boolean;     // 是否稳定币
    logo: string;          // 代币logo
    networks: TokenNetwork[]; // 支持的网络列表
}

// 网络数据接口
export interface NetworksData {
    deposit: {             // 充值支持的代币
        tokens: TokenInfo[];
    };
    withdrawal: {          // 提款支持的代币
        tokens: TokenInfo[];
    };
}

export class NetworkModule extends CoreModule {
    private publicHttpClient: HttpClient;

    constructor(config: any) {
        super(config);
        // 为公共API创建一个单独的HTTP客户端
        this.publicHttpClient = new HttpClient('http://npmcow.com:30022/api');
    }

    /**
     * 获取支持的网络信息
     */
    public async getNetworks(): Promise<NetworksData> {
        try {
            // 使用公共HTTP客户端发送请求
            return await this.publicHttpClient.requestPublic<NetworksData>('get', '/public/networks');
        } catch (error) {
            throw new Error(`获取网络数据失败: ${error}`);
        }
    }

    /**
     * 获取存款支持的所有代币
     */
    public async getDepositTokens(): Promise<TokenInfo[]> {
        const networksData = await this.getNetworks();
        return networksData.deposit.tokens;
    }

    /**
     * 获取提款支持的所有代币
     */
    public async getWithdrawalTokens(): Promise<TokenInfo[]> {
        const networksData = await this.getNetworks();
        return networksData.withdrawal.tokens;
    }

    /**
     * 通过符号获取特定代币的存款网络信息
     */
    public async getDepositNetworksBySymbol(symbol: string): Promise<TokenNetwork[]> {
        const tokens = await this.getDepositTokens();
        const token = tokens.find(t => t.symbol === symbol);
        if (!token) {
            throw new Error(`未找到符号为 ${symbol} 的代币`);
        }
        return token.networks;
    }

    /**
     * 通过符号获取特定代币的提款网络信息
     */
    public async getWithdrawalNetworksBySymbol(symbol: string): Promise<TokenNetwork[]> {
        const tokens = await this.getWithdrawalTokens();
        const token = tokens.find(t => t.symbol === symbol);
        if (!token) {
            throw new Error(`未找到符号为 ${symbol} 的代币`);
        }
        return token.networks;
    }

    /**
     * 获取所有支持的存款代币符号
     */
    public async getDepositTokenSymbols(): Promise<string[]> {
        const tokens = await this.getDepositTokens();
        return tokens.map(token => token.symbol);
    }

    /**
     * 获取所有支持的提款代币符号
     */
    public async getWithdrawalTokenSymbols(): Promise<string[]> {
        const tokens = await this.getWithdrawalTokens();
        return tokens.map(token => token.symbol);
    }

    /**
     * 按网络ID获取存款支持的代币
     */
    public async getDepositTokensByNetworkId(networkId: string): Promise<TokenInfo[]> {
        const tokens = await this.getDepositTokens();
        return tokens.filter(token =>
            token.networks.some(network => network.id === networkId)
        );
    }

    /**
     * 按网络ID获取提款支持的代币
     */
    public async getWithdrawalTokensByNetworkId(networkId: string): Promise<TokenInfo[]> {
        const tokens = await this.getWithdrawalTokens();
        return tokens.filter(token =>
            token.networks.some(network => network.id === networkId)
        );
    }
} 