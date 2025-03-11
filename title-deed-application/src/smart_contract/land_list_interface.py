from web3 import Web3
from web3.exceptions import ContractLogicError
import json
import os
import warnings

warnings.filterwarnings("ignore")

current_path = os.path.dirname(__file__)

with open(os.path.join(current_path,"../config.json"),"r") as f:
    config = json.loads(f.read())

web3 = Web3(Web3.HTTPProvider(config["blockchain_address"]))
file_contract = None
account_list = None

with open(os.path.join(current_path,"./land_list_address.json"),"r") as f:
    land_list_address = json.loads(f.read())["address"]

with open(os.path.join(current_path,"./abi/land_list_abi.json"),"r") as f:
    land_list_abi = json.loads(f.read())

land_list_contract = web3.eth.contract(abi=land_list_abi,address=land_list_address)

def add_land_list(deploy_address:str,sheet_number:int,contract_address:str) -> dict:
    if(not web3.is_address(deploy_address)):
        return {"status":0,"output":f"address {deploy_address} is invalid."}
    
    if(not web3.is_address(contract_address)):
        return {"status":0,"output":f"address {contract_address} is invalid."}
    
    if(not len(web3.eth.get_code(contract_address)) > 2):
        return {"status":0,"output":f"address {contract_address} is not contract."}
    
    if(deploy_address not in web3.eth.accounts):
        return {"status":0,"output":f"Address {deploy_address} does not exist in blockchain"}

    if(contract_address == land_list_address):
        return {"status":0,"output":f"Address {land_list_address} is reserved"}
    
    if(get_contract_by_num(sheet_number)["status"] == 1):
        return {"status":0,"output":"Sheet number already exist"}
    
    if(get_num_by_contract(contract_address)["status"] == 1):
        return {"status":0,"output":"Contract address already exist"}
    
    if(sheet_number <= 0):
        return {"status":0,"output":f"Sheet number {sheet_number} is invalid."}
    
    try:
        land_list_contract.functions.add_sheet_list(sheet_number,contract_address).transact({"from":deploy_address})
        return {"status":1,"output":f"add sheet number {sheet_number} successfully"}
    
    except Exception as e:
        return {"status":0,"output":e}
    
def get_sheet_list() -> dict:
    result = land_list_contract.functions.get_sheet_list().call()
    return {"status":1,"output":tuple(result)}

def get_contract_list() -> dict:
    result = land_list_contract.functions.get_contract_list().call()
    return {"status":1,"output":tuple(result)}

def get_contract_by_num(sheet_number:int) -> dict:

    if(sheet_number <= 0):
        return {"status":0,"output":f"sheet number {sheet_number} is invalid."}
    
    result = land_list_contract.functions.get_contract_by_num(sheet_number).call()
    if result == "0x0000000000000000000000000000000000000000":
        return {"status":0,"output":"Sheet number does not exist"}
    
    return {"status":1,"output":str(result)}

def get_num_by_contract(contract_address:str):
    if(not web3.is_address(contract_address)):
        return {"status":0,"output":f"address {contract_address} is invalid."}
    
    if(not len(web3.eth.get_code(contract_address)) > 2):
        return {"status":0,"output":f"address {contract_address} is not contract."}
    
    if(contract_address == land_list_address):
        return {"status":0,"output":f"address {contract_address} is reserved."}
    
    result = land_list_contract.functions.get_num_by_contract(contract_address).call()
    
    if(result == 0):
        return {"status":0,"output":"Contract address does not exist"}
    
    return {"status":1,"output":int(result)}

def check_authorize(caller_address:str) -> dict:
    if(caller_address not in web3.eth.accounts):
        return {"status":0,"output":f"Address {caller_address} does not exist in blockchain"}
    
    result = land_list_contract.functions.check_authorize(caller_address).call()
    if(result):
        return {"status":1,"output":bool(result)}
    else:
        return {"status":0,"output":bool(result)}
    

def authorize(caller_address:str,user_address:str) -> dict:
    if(caller_address not in web3.eth.accounts):
        return {"status":0,"output":f"Address {caller_address} does not exist in blockchain"}
    
    if(user_address not in web3.eth.accounts):
        return {"status":0,"output":f"Address {user_address} does not exist in blockchain"}
    
    try:
        land_list_contract.functions.authorize(user_address).transact({"from":caller_address})
        return {"status":1,"output":f"Authorized {user_address} successfully."}
    
    except Exception as e:
        return {"status":0,"output":e}
    
def revoke(caller_address:str,user_address:str) -> dict:
    if(caller_address not in web3.eth.accounts):
        return {"status":0,"output":f"Address {caller_address} does not exist in blockchain"}
    
    if(user_address not in web3.eth.accounts):
        return {"status":0,"output":f"Address {user_address} does not exist in blockchain"}

    try:
        land_list_contract.functions.revoke(user_address).transact({"from":caller_address})
        return {"status":1,"output":f"Revoked {user_address} successfully."}
    
    except Exception as e:
        return {"status":0,"output":e}
    
def get_last_sheet_number():
    result = land_list_contract.functions.get_last_sheet_number().call()
    return {"status":1,"output":int(result)}

def get_log():
    result = land_list_contract.functions.get_log().call()
    return {"status":1,"output":tuple(result)}
