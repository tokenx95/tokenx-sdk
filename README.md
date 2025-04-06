# TokenX SDK

用于与TokenX API进行交互的JavaScript/TypeScript SDK。

## TokenX 官方网站

访问 [TokenX 官方网站](https://tokenex.pro) 获取更多信息。

## 安装
```bash
npm install tokenx-sdk
```

## 使用方法

### 初始化SDK

```typescript
import TokenX from 'tokenx-sdk';

const tokenX = new TokenX({
    clientKey: 'your_client_key',
    clientSecret: 'your_client_secret'  
});
```

### 生成签名

```typescript
const signature = tokenX.createSignature();
console.log(signature);
// 输出:
// {
// signature: '...', // 生成的签名
// requestId: '...', // 请求ID
// timestamp: 1234567890 // 时间戳
// }
```

### 使用 CommonJS 导入

```javascript
const TokenX = require('tokenx-sdk').default;

const tokenx = new TokenX({
    clientKey: 'your_client_key',
    clientSecret: 'your_client_secret'  
});
```

### 使用 ES 模块导入

```javascript
import TokenX from 'tokenx-sdk';

const tokenx = new TokenX({
    clientKey: 'your_client_key',
    clientSecret: 'your_client_secret'  
});
```

### 获取用户数据

```javascript
// 使用CommonJS
const TokenX = require('tokenx-sdk').default;

// 或使用ES模块
// import TokenX from 'tokenx-sdk';

const tokenx = new TokenX({
    clientKey: 'your_client_key',
    clientSecret: 'your_client_secret'  
});

// 异步获取用户数据
async function getUserInfo() {
    try {
        const userData = await tokenx.getUserData();
        console.log('用户基本信息:', userData.basic);
        console.log('钱包信息:', userData.wallet);
    } catch (error) {
        console.error('获取用户数据失败:', error);
    }
}

getUserInfo();
```

### 自定义API请求

SDK提供了通用的request方法，可以用来调用任何TokenX API:

```javascript
// GET请求示例
const userInfo = await tokenx.request('get', '/user/overview');

// POST请求示例
const result = await tokenx.request('post', '/some/endpoint', {
    param1: 'value1',
    param2: 'value2'
});
```

### 使用模块化API

TokenX SDK现在采用模块化设计，各功能按照领域进行组织:

```javascript
const Tokenx = require('tokenx-sdk').default;

const tokenx = new Tokenx({
    clientKey: 'your_client_key',
    clientSecret: 'your_client_secret'
});

// 使用用户模块
const userData = await tokenx.user.getUserData();

// 使用网络模块
const networks = await tokenx.network.getNetworks();
const depositTokens = await tokenx.network.getDepositTokens();
const usdcNetworks = await tokenx.network.getDepositNetworksBySymbol('USDC');

// 使用核心模块
const signature = tokenx.core.createSignature();
```

## 许可证

MIT