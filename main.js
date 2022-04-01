import signer from '@zondax/filecoin-signing-tools';
import FilecoinRPC from '@zondax/filecoin-signing-tools/utils';
import bip39 from 'bip39';
import axios from 'axios';

const URL = "https://dev.node.glif.io/calibrationapi/lotus/rpc/v0";
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.OAHyV5YqXe34-Hd4nwYNdHn2qaPS5veIq21xPYXzq7s' 
const headers = { 'Authorization': `Bearer ${token}` }
const filRPC = new FilecoinRPC({ url: URL, token: token })

const mnemonic = signer.generateMnemonic();
console.log(mnemonic);
const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');

// const path = "m/44'/461'/0'/0/1"; - bip44 path

const keypair = signer.keyDeriveFromSeed(seed, "m/44'/461'/0'/0/1");


console.log(keypair);
console.log(keypair.public_hexstring)
console.log(keypair.private_base64)
console.log(keypair.address)

const privateKey = "MAZUuVa3NYN4Z7Y9XMp8naHQ2mbHuACmp6uWjmiTYI4="
const public_from = "f1zprvrzq3cwnxzjjawctycrbzzcbqb6v2wc6udty"


// отправка файла
const transaction = {
    "Version": 0,
    "To": "f010479",
    "From": "f1zprvrzq3cwnxzjjawctycrbzzcbqb6v2wc6udty",
    "Nonce": 17,
    "Value": "0",
    "GasLimit": 2455630000,
    "GasFeeCap": "99860", 
    "GasPremium": "0",
    "Method": 1,
    "params": "",
    "CID": {
      "/": "bafykbzacedi7nhjoyor6pi7bno4auct25vxgaqes5vua23qb5vabbj67fcwbo"
    }
}

// перевод токенов
// const transaction = {
//     From: public_from,
//     GasFeeCap: '99803',
//     GasLimit: 2455630000,
//     GasPremium: '99803',
//     Method: 0,
//     Nonce: 13,
//     Params: '',
//     To: 'f15vsv7nsh52he6bn2u6hgqnqd25tsx4rlgqr5kfq',
//     Value: '10000000000000000000'
// }

const signed_tx = signer.transactionSign(transaction, privateKey);

console.log(signed_tx);


const data = JSON.stringify({
    "jsonrpc": "2.0",
    "method": "Filecoin.MpoolPush", 
    "id": 1,
    "params": [signed_tx],
});

const config = {
    method: 'post',
    url: 'https://dev.node.glif.io/calibrationapi/lotus/rpc/v0',
    headers: { 
        'Authorization': 'Bearer ', 
        'Content-Type': 'application/json'
    },
    data : data
};
axios(config)
.then(function (response) {
    console.log(response.data);
})
.catch(function (error) {
    console.log(error.response.data);
});


// const ChainGetBlock = JSON.stringify({
//     "jsonrpc": "2.0",
//     "method": "Filecoin.ChainGetMessage", 
//     "id": 1,
//     "params": [
//         {
//           "/": "bafy2bzaceafinv5krdkm4kzvsndrgp36kvek73543ofbtyn7bz5oe2gnjvycy"
//         }
//       ]
// });

// const req = {
//     method: 'post',
//     url: 'https://dev.node.glif.io/calibrationapi/lotus/rpc/v0',
//     headers: { 
//         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiXX0.etYIIxqdpxdmLLzdsgj3ThFNPnFA2Fq6trXzmTYlPR8', 
//         'Content-Type': 'application/json'
//     },
//     data : ChainGetBlock
// };
// axios(req)
// .then(function (response) {
//     console.log(response.data);
// })
// .catch(function (error) {
//     console.log(error);
// });

