import signer from '@zondax/filecoin-signing-tools';
import FilecoinRPC from '@zondax/filecoin-signing-tools/utils';
import bip39 from 'bip39';
import axios from 'axios';

const address = "f15vsv7nsh52he6bn2u6hgqnqd25tsx4rlgqr5kfq"

const check_balance = JSON.stringify({
    "jsonrpc": "2.0",
    "method": "Filecoin.WalletBalance", 
    "id": 1,
    "params": [address]
});

const req = {
    method: 'post',
    url: 'https://dev.node.glif.io/calibrationapi/lotus/rpc/v0',
    headers: { 
        'Authorization': 'Bearer ', 
        'Content-Type': 'application/json'
    },
    data : check_balance
};
axios(req)
.then(function (response) {
    console.log(response.data);
})
.catch(function (error) {
    console.log(error);
});