import signer from '@zondax/filecoin-signing-tools';
import FilecoinRPC from '@zondax/filecoin-signing-tools/utils';
import bip39 from 'bip39';
import axios from 'axios';

const URL = "https://api.node.glif.io";
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiXX0.etYIIxqdpxdmLLzdsgj3ThFNPnFA2Fq6trXzmTYlPR8' 
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


const transaction = {
    "Version": 0,
    "To": "f010479",
    "From": "f15vsv7nsh52he6bn2u6hgqnqd25tsx4rlgqr5kfq",
    "Nonce": 0,
    "Value": "0",
    "GasLimit": 2455630000,
    "GasFeeCap": "100", // тут пробовала 0, но пишет, что gas fee cap too low
    "GasPremium": "0",
    "Method": 1,
    "params": "",
    "CID": {
      "/": "bafy2bzacebbpdegvr3i4cosewthysg5xkxpqfn2wfcz6mv2hmoktwbdxkax4s"
    }
}

const signed_tx = signer.transactionSign(transaction, keypair.private_base64);

console.log(signed_tx);


const data = JSON.stringify({
    "jsonrpc": "2.0",
    "method": "Filecoin.MpoolPush", 
    "id": 1,
    "params": [signed_tx]
});

const config = {
    method: 'post',
    url: 'https://api.node.glif.io',
    headers: { 
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiXX0.etYIIxqdpxdmLLzdsgj3ThFNPnFA2Fq6trXzmTYlPR8', 
        'Content-Type': 'application/json'
    },
    data : data
};
axios(config)
.then(function (response) {
    console.log(response.data);
})
.catch(function (error) {
    console.log(error);
});


