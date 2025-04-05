import { TokenX } from 'tokenx-sdk';

// 初始化TokenX SDK
const tokenx = new TokenX({
    clientKey: '',
    clientSecret: ''
});

// 获取用户信息
async function getUserInfoFunction() {
    try {
        const userData = await tokenx.user.getUserData();
        console.log('用户信息:', userData);
        console.log('用户ID:', userData.basic.uid);
        console.log('邮箱:', userData.basic.email);
        console.log('昵称:', userData.basic.nickname);
    } catch (error) {
        console.error('获取用户信息失败:', error);
    }
}

// 获取子钱包地址列表
async function getSubWalletsFunction() {
    try {
        const subWallets = await tokenx.user.getSubWallets({
            page: 1,
            pageSize: 10
        });
        console.log('子钱包总数:', subWallets.totalNumber);
        console.log('子钱包列表:', subWallets.subWallets);
    } catch (error) {
        console.error('获取子钱包列表失败:', error);
    }
}

// 获取所有子钱包地址
async function getAllSubWalletAddressesFunction() {
    try {
        const addresses = await tokenx.user.getAllSubWalletAddresses();
        console.log('所有子钱包地址:', addresses);
        console.log('总数量:', addresses.length);
    } catch (error) {
        console.error('获取所有子钱包地址失败:', error);
    }
}

// 分配账户钱包地址
async function allocateAccountWalletAddressFunction() {
    try {
        const result = await tokenx.user.allocateAccountWalletAddress();
        console.log('分配结果:', result);
        console.log('新分配的地址:', result.newEvmAddress);
        console.log('所有地址:', result.totalEvmAddresses);
    } catch (error) {
        console.error('分配账户钱包地址失败:', error);
    }
}

// 分配单个账户钱包地址(简化版)
async function allocateAccountWalletAddressSimpleFunction() {
    try {
        const address = await tokenx.user.allocateAccountWalletAddressSimple();
        console.log('新分配的地址:', address);
    } catch (error) {
        console.error('分配账户钱包地址失败:', error);
    }
}

// 设置子钱包回调URL（其中主URL必填，备用URL1和备用URL2可选）
async function setSubWalletCallbackUrlsFunction() {
    try {
        const result = await tokenx.user.setSubWalletCallbackUrls({
            primaryUrl: 'https://main.api.com',
            backupUrl1: '',
            backupUrl2: 'https://bck2.api.com'
        });
        console.log('回调URL设置结果:', result);
    } catch (error) {
        console.error('设置回调URL失败:', error);
    }
}

// 设置子钱包回调密钥（用于回调验证鉴权）
async function setSubWalletCallbackKeyFunction() {
    try {
        const result = await tokenx.user.setSubWalletCallbackKey('your-callback-key');
        console.log('回调密钥设置结果:', result);
    } catch (error) {
        console.error('设置回调密钥失败:', error);
    }
}

// 免费分配子钱包地址（免费数量100）
async function allocateFreeSubWalletsFunction() {
    try {
        const result = await tokenx.user.allocateFreeSubWallets(1);
        console.log('免费分配结果:', result);
        console.log('分配的地址:', result.address);
    } catch (error) {
        console.error('免费分配子钱包地址失败:', error);
    }
}

// 付费购买子钱包地址（自动计算最优价格并扣除，支持免费数量抵扣，但需要保持账户USDT余额大于等于购买地址数量的总价）
async function purchaseSubWalletsFunction() {
    try {
        const result = await tokenx.user.purchaseSubWallets(1);
        console.log('购买结果:', result);
        console.log('购买的地址:', result.address);
    } catch (error) {
        console.error('购买子钱包地址失败:', error);
    }
}

// 获取支持的网络信息
async function getNetworksFunction() {
    try {
        const networks = await tokenx.network.getNetworks();
        console.log('支持的网络信息:', networks);
        console.log('充值代币数量:', networks.deposit.tokens.length);
        console.log('提现代币数量:', networks.withdrawal.tokens.length);
    } catch (error) {
        console.error('获取网络信息失败:', error);
    }
}

// 获取存款支持的代币
async function getDepositTokensFunction() {
    try {
        const tokens = await tokenx.network.getDepositTokens();
        console.log('存款支持的代币:', tokens);
        console.log('代币符号列表:', tokens.map(token => token.symbol));
    } catch (error) {
        console.error('获取存款代币失败:', error);
    }
}

// 获取特定代币的存款网络
async function getDepositNetworksBySymbolFunction() {
    try {
        const networks = await tokenx.network.getDepositNetworksBySymbol('USDC');
        console.log('USDC存款网络:', networks);
        console.log('网络名称列表:', networks.map(network => network.name));
    } catch (error) {
        console.error('获取代币存款网络失败:', error);
    }
}

async function getDepositRecordsFunction() {
    try {
        const records = await tokenx.user.getDepositRecords();
        console.log('存款记录:', records);
    } catch (error) {
        console.error('获取存款记录失败:', error);
    }
}

async function getDepositRecordsByTypeFunction() {
    try {
        const records = await tokenx.user.getDepositRecordsByType(1);
        console.log('账户充值记录:', records);
    } catch (error) {
        console.error('获取账户充值记录失败:', error);
    }
}

async function getDepositRecordsByTokenFunction() {
    try {
        const records = await tokenx.user.getDepositRecordsByToken('ETH');
        console.log('USDC存款记录:', records);
    } catch (error) {
        console.error('获取USDC存款记录失败:', error);
    }
}

async function getDepositRecordsByTimeRangeFunction() {
    try {
        const records = await tokenx.user.getDepositRecordsByTimeRange('2025-03-24T16:00:00.000Z', '2025-03-26T16:00:00.000Z');
        console.log('时间范围存款记录:', records);
    } catch (error) {
        console.error('获取时间范围存款记录失败:', error);
    }
}

async function getDepositRecordsByAddressOrHashFunction() {
    try {
        const records = await tokenx.user.getDepositRecordsByAddressOrHash('0xa550ae44a07cbec5a965011e3efa33f688012fa6d81aff5c0edabfe7233a15ea');
        console.log('地址或哈希存款记录:', records);
    } catch (error) {
        console.error('获取地址或哈希存款记录失败:', error);
    }
}

// 运行示例
async function runExample() {
    await getDepositRecordsByAddressOrHashFunction();
}

// 执行示例
runExample().catch(console.error);