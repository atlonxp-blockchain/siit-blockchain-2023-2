from web3 import Web3
from solcx import compile_standard, install_solc
from land_list_interface import get_last_sheet_number, get_contract_by_num, add_land_list
import json, os
import sys

parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(parent_dir)

from util_lib import util_lib

current_path = os.path.dirname(__file__)

with open(os.path.join(current_path,"../config.json"),"r") as f:
    config = json.loads(f.read())

web3 = Web3(Web3.HTTPProvider(config["blockchain_address"]))
install_solc("0.8.19")

def deploy_land_list(deploy_address:str,authorized_list:list[str]) -> dict:
    if(deploy_address not in web3.eth.accounts):
        return {"status":0,"output":f"address {deploy_address} is invalid."}
    
    for address in authorized_list:
        if(address not in web3.eth.accounts):
            return{"status":0,"output":f"address {address} is invalid."}
        
    authorized_list.append(deploy_address)
    sol_file_path = os.path.join(current_path,"./land_list.sol")
    sol_file_name = "land_list.json"
    contract_name = "land_list"

    with open(sol_file_path,"r") as f:
        contract_file = f.read()

    complied_contract_solidity = compile_standard(
        {
            "language": "Solidity",
            "sources": {sol_file_name: {"content": contract_file}},
            "settings": {
                "outputSelection": {
                    "*": {"*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]}
                }
            },
        },
        solc_version="0.8.19"
    )

    bytecode = complied_contract_solidity["contracts"][sol_file_name][contract_name]["evm"]["bytecode"]["object"]
    abi = complied_contract_solidity["contracts"][sol_file_name][contract_name]["abi"]

    try:
        land_list_contract = web3.eth.contract(abi=abi,bytecode=bytecode)
        tx_hash = land_list_contract.constructor(authorized_list).transact({'from': deploy_address})
        transaction_confirm = web3.eth.wait_for_transaction_receipt(tx_hash)
        contract_address = transaction_confirm['contractAddress']

    except Exception as e:
        return {"status":0,"output":e}

    with open(os.path.join(current_path,"./land_list_address.json"),"w") as f:
        json.dump({"address":contract_address,"deploy_address":deploy_address,"contract_name":"land_list"},f,indent=4)

    with open(os.path.join(current_path,f"./abi/land_list_abi.json"),"w") as f:
        json.dump(abi,f,indent=4)

    return {"status":1,"output":f"deploy contract at {contract_address} successfully."}

def deploy_land_contract(
        deploy_address:str,
        authorized_list:list[str],
        national_ID:int,
        land_size:float,
        holder_name:list[str],
        coordinates:list[tuple],
        land_address:str,
        land_size_manual:bool=False):
    
    if(deploy_address not in web3.eth.accounts):
        return {"status":0,"output":f"address {deploy_address} is invalid."}
    
    for address in authorized_list:
        if(address not in web3.eth.accounts):
            return{"status":0,"output":f"address {address} is invalid."}
        
    if(land_size <= 0):
        return {"status":0,"output":f"land size {land_size} is invalid."}
    
    if(not util_lib.is_valid_thai_id(national_ID)):
        return {"status":0,"output":f"national ID {national_ID} is invalid."}
    
    if(not util_lib.is_valid_holder_name(holder_name)):
        return {"status":0,"output":f"holder name {holder_name} is invalid."}
    
    holder_name = " ".join(holder_name)
    
    coordinates = util_lib.reorder_coordinate(coordinates)
    for c in coordinates:
        if(not util_lib.is_coordinate_valid(c,config["use_OSM"])):
            return {"status":0,"output":f"coordinate {c} is invalid"}
        
    #if(not util_lib.is_valid_address(land_address)):
    #    return {"status":0,"output":"land address is invalid"}
        
    authorized_list.append(deploy_address)
    sol_file_path = os.path.join(current_path,"./land_document.sol")
    sol_file_name = "land_document.json"
    contract_name = "land_document"

    with open(sol_file_path,"r") as f:
        contract_file = f.read()

    complied_contract_solidity = compile_standard(
        {
            "language": "Solidity",
            "sources": {sol_file_name: {"content": contract_file}},
            "settings": {
                "outputSelection": {
                    "*": {"*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]}
                }
            },
        },
        solc_version="0.8.19"
    )

    bytecode = complied_contract_solidity["contracts"][sol_file_name][contract_name]["evm"]["bytecode"]["object"]
    abi = complied_contract_solidity["contracts"][sol_file_name][contract_name]["abi"]

    if(land_size_manual == True):
        land_size_constructor = str(land_size)
    
    else:
        land_size_constructor = str(util_lib.calculate_area(coordinates))


    sheet_number_constructor = get_last_sheet_number()["output"]+1

    try:
        land_list_contract = web3.eth.contract(abi=abi,bytecode=bytecode)

        constructor_parameters = {
            "_sheet_number":int(sheet_number_constructor),
            "_national_ID":int(national_ID),
            "_land_size":land_size_constructor,
            "_holder_name":holder_name,
            "_coordinates":str(coordinates),
            "_land_address":land_address,
            "authorized_list":authorized_list
        }

        tx_hash = land_list_contract.constructor(**constructor_parameters).transact({'from': deploy_address})
        transaction_confirm = web3.eth.wait_for_transaction_receipt(tx_hash)
        contract_address = transaction_confirm['contractAddress']

    except Exception as e:
        return {"status":0,"output":e}

    with open(os.path.join(current_path,f"./abi/sheet_number{sheet_number_constructor}_abi.json"),"w") as f:
        json.dump(abi,f,indent=4)

    add_land_list(deploy_address,sheet_number_constructor,contract_address)    
    return {"status":1,"output":f"deploy contract at {contract_address} successfully."}