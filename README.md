# TokenX SDK

用于与TokenX API进行交互的JavaScript/TypeScript SDK。

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


## 许可证

MIT