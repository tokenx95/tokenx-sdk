import { TokenX } from '../src/index';

const tokenx = new TokenX({
    clientKey: 'akk7fayadve47ud7w2z4r7gpxyps2fr859',
    clientSecret: 'skkt95ed264gw3kcdx2jh2esv21ddcxt8knyhpjzu1sc1cp1j9'
});





async function test() {
    const withdrawRecords = await tokenx.user.getWithdrawalRecordsByTimeRange('2025-04-17T15:07:37.003Z', '2025-04-17T15:07:37.003Z')
    console.log(withdrawRecords);
}

test();
