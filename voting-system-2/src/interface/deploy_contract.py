from web3 import Web3
from solcx import compile_standard, install_solc
import json, os
import sys

current_path = os.path.dirname(__file__)

with open(os.path.join(current_path,"../config.json"),"r") as f:
    config = json.loads(f.read())

web3 = Web3(Web3.HTTPProvider(config["blockchain_address"]))
install_solc("0.8.17")

def deploy_contract(deploy_address:str) -> dict:
    if(deploy_address not in web3.eth.accounts):
        return {"status":0,"output":f"address {deploy_address} is invalid."}
    
    solidity_file = config["solidity_file_name"]
    solidity_file_name = solidity_file+".sol"
    contract_name = solidity_file
    sol_file_path = os.path.join(current_path,f"../contract/{solidity_file_name}")

    with open(sol_file_path,"r") as f:
        contract_file = f.read()

    complied_contract_solidity = compile_standard(
        {
            "language": "Solidity",
            "sources": {solidity_file_name: {"content": contract_file}},
            "settings": {
                "outputSelection": {
                    "*": {"*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]}
                }
            },
        },
        solc_version="0.8.17"
    )

    bytecode = complied_contract_solidity["contracts"][solidity_file_name][contract_name]["evm"]["bytecode"]["object"]
    abi = complied_contract_solidity["contracts"][solidity_file_name][contract_name]["abi"]

    try:
        contract = web3.eth.contract(abi=abi,bytecode=bytecode)
        tx_hash = contract.constructor().transact({'from': deploy_address})
        transaction_confirm = web3.eth.wait_for_transaction_receipt(tx_hash)
        contract_address = transaction_confirm['contractAddress']

    except Exception as e:
        return {"status":0,"output":e}

    with open(os.path.join(current_path,"./contract_address.json"),"w") as f:
        json.dump({"address":contract_address,"deploy_address":deploy_address,"contract_name":contract_name},f,indent=4)

    with open(os.path.join(current_path,f"./contract_abi.json"),"w") as f:
        json.dump(abi,f,indent=4)

    return {"status":1,"output":f"deploy contract at {contract_address} successfully."}

if __name__ == "__main__":
    deploy_contract(web3.eth.accounts[0])