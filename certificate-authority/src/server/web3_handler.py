import json

from web3 import Web3, HTTPProvider
from eth_keys import keys, KeyAPI
from eth_utils import decode_hex

w3 = Web3(HTTPProvider('http://127.0.0.1:8545'))
with open('abi/authentication.json') as f:
    abi = json.load(f)

contract_auth = w3.eth.contract(address='0x3523C0c25706e529EFD43F1adFE3B8c305ecA340', abi=abi)

with open('abi/certificate.json') as f:
    abi = json.load(f)

contract_cert = w3.eth.contract(address='0x6d1f8C31143A4Ced1A7D89765fc90764B6fb3735', abi=abi)