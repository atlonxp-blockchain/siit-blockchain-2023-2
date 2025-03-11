from web3 import Web3
from web3.exceptions import ContractLogicError
import json
import os, sys
import warnings
import datetime

from land_list_interface import get_sheet_list, get_contract_by_num

parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(parent_dir)

from util_lib import util_lib
warnings.filterwarnings("ignore")

current_path = os.path.dirname(__file__)

with open(os.path.join(current_path,"../config.json"),"r") as f:
    config = json.loads(f.read())

web3 = Web3(Web3.HTTPProvider(config["blockchain_address"]))
smart_contract = None
global_sheet_number = None

def select_contract(sheet_number) -> dict:

    global smart_contract, global_sheet_number
    contract_address = get_contract_by_num(sheet_number)
    if(contract_address["status"] <= 0):
        return {"status":0,"output":f"Sheet number {sheet_number} does not exist"}
    
    contract_address = contract_address["output"]

    try:
        with open(os.path.join(current_path,f"./abi/sheet_number{sheet_number}_abi.json"),"r") as f:
            contract_abi = f.read()

    except:
        return {"status":0,"output":f"cannot find ABI"}
    
    try:
        smart_contract = web3.eth.contract(address=contract_address,abi=contract_abi)

    except:
        return {"status":0,"output":"Either contract address or blockchain address is invalid"}
    
    global_sheet_number = sheet_number
    return {"status":1,"output":f"select contract address {contract_address} successfully."}

def cancel_document(caller_address):
    global smart_contract, global_sheet_number

    if(not web3.is_address(caller_address)):
        return {"status":0,"output":f"address {caller_address} is invalid."}
    
    if(len(web3.eth.get_code(caller_address)) > 2):
        return {"status":0,"output":f"address {caller_address} is not account address."}

    try:
        result = smart_contract.functions.cancel_document().transact({"from":caller_address})
        return {"status":1,"output":f"cancel sheet {global_sheet_number} successfully"}

    except Exception as e:
        return {"status":0,"output":e}
    
def reactivate(caller_address):
    global smart_contract, global_sheet_number

    if(not web3.is_address(caller_address)):
        return {"status":0,"output":f"address {caller_address} is invalid."}
    
    if(len(web3.eth.get_code(caller_address)) > 2):
        return {"status":0,"output":f"address {caller_address} is not account address."}

    try:
        result = smart_contract.functions.reactivate().transact({"from":caller_address})
        return {"status":1,"output":f"reactivate sheet {global_sheet_number} successfully"}

    except Exception as e:
        return {"status":0,"output":e}
    
def change_region(caller_address,land_size,coordinates,land_address):
    if(not web3.is_address(caller_address)):
        return {"status":0,"output":f"address {caller_address} is invalid."}
    
    if(len(web3.eth.get_code(caller_address)) > 2):
        return {"status":0,"output":f"address {caller_address} is not account address."}
    
    if(land_size <= 0):
        return {"status":0,"output":f"land size {land_size} is invalid."}
    
    for c in coordinates:
        if(not util_lib.is_coordinate_valid(c)):
            return {"status":0,"output":f"coordinates {c} is invalid"}
        
    #if(not util_lib.is_valid_address(land_address)):
    #    return {"status":0,"output":f"land address {land_address} is invalid."}

    try:
        result = smart_contract.functions.change_region(str(land_size),str(coordinates),str(land_address)).transact({"from":caller_address})
        return {"status":1,"output":f"modify region sheet {global_sheet_number} successfully"}
    
    except Exception as e:
        return {"status":0,"output":e}
    
def transfer(caller_address, national_ID, holder_name):

    global smart_contract, global_sheet_number

    if(not web3.is_address(caller_address)):
        return {"status":0,"output":f"address {caller_address} is invalid."}
    
    if(len(web3.eth.get_code(caller_address)) > 2):
        return {"status":0,"output":f"address {caller_address} is not account address."}
    
    if(not util_lib.is_valid_thai_id(national_ID)):
        return {"status":0,"output":f"National ID {national_ID} is invalid."}
    
    if(not util_lib.is_valid_holder_name(holder_name)):
        return {"status":0,"output":f"Holder name {holder_name} is invalid"}
    
    try:
        result = smart_contract.functions.transfer(national_ID," ".join(holder_name)).transact({"from":caller_address})
        return {"status":1,"output":f"transfer ownership of sheet {global_sheet_number} successfully"}
    
    except Exception as e:
        return {"status":0,"output":e}
        
def get_log():
    global smart_contract
    output = []
    result = smart_contract.functions.get_log().call()
    for log in result:
        event_time = util_lib.timestamp_to_date_string(log[0])
        output.append([event_time, log[1], log[2]])
    return {"status":1,"output":output}

def get_hold_history(show_ID=False):
    global smart_contract
    keys = ["holder_national_ID","holder_hold_time","parcel_number","holder_name"]
    result = smart_contract.functions.get_hold_history().call()
    for i in range(len(result)):
        result[i] = list(result[i])
        result[i][1] = util_lib.timestamp_to_date_string(result[i][1])
        result[i] = dict(map(lambda i,j : (i,j) , keys,result[i]))

        if(show_ID == False):
            holder_ID = result[i]["holder_national_ID"]
            holder_ID = str(holder_ID)
            new_ID = ""
            for j in range(len(holder_ID)):
                if(j in [7,8,9,10,11,12]):
                    new_ID += "X"
                else:
                    new_ID += holder_ID[j]

            result[i]["holder_national_ID"] = new_ID
    return {"status":1,"output":result}

def get_parcel_history():
    global smart_contract
    result = smart_contract.functions.get_parcel_history().call()

    keys = ["parcel_number","land_size","create_time","coordinates","land_address"]
    for i in range(len(result)):
        result[i] = list(result[i])
        result[i][2] = util_lib.timestamp_to_date_string(result[i][2])
        result[i][1] = float(result[i][1])
        result[i][3] = eval(result[i][3])

        coor = ""
        for j in result[i][3]:
            coor += (str(j)+" ")

        result[i][3] = coor
            
        result[i] = dict(map(lambda i,j : (i,j) , keys,result[i]))

    return {"status":1,"output":result}

def get_metadata():
    global smart_contract
    result = smart_contract.functions.get_metadata().call()
    keys = ["sheet_number","create_time","assigner_address","active"]
    result = dict(map(lambda i,j : (i,j) , keys,result))
    result["formatted_create_time"] = util_lib.timestamp_to_date_string(result["create_time"])
    return {"status":1,"output":result}

def get_last_record():
    global smart_contract
    result = smart_contract.functions.get_last_record().call()
    keys = ["holder_national_ID","holder_hold_time","parcel_number","holder_name","land_size","assign_time","coordinates","land_address"]
    result = dict(map(lambda i,j : (i,j) , keys,result))
    result["coordinates"] = eval(result["coordinates"])
    result["land_address"] = result["land_address"].split()
    result["holder_hold_time"] = util_lib.timestamp_to_date_string(result["holder_hold_time"])
    result["land_size"] = float(result["land_size"])
    result["assign_time"] = util_lib.timestamp_to_date_string(result["assign_time"])
    if(result["coordinates"][0] == result["coordinates"][-1]):
        del result["coordinates"][-1]

    return {"status":1,"output":result}

def authorize(caller_address:str,user_address:str) -> dict:
    global smart_contract
    if(caller_address not in web3.eth.accounts):
        return {"status":0,"output":f"Address {caller_address} does not exist in blockchain"}
    
    if(user_address not in web3.eth.accounts):
        return {"status":0,"output":f"Address {user_address} does not exist in blockchain"}
    
    try:
        smart_contract.functions.authorize(user_address).transact({"from":caller_address})
        return {"status":1,"output":f"Authorized {user_address} successfully."}
    
    except Exception as e:
        return {"status":0,"output":e}
    
def revoke(caller_address:str,user_address:str) -> dict:
    global smart_contract
    if(caller_address not in web3.eth.accounts):
        return {"status":0,"output":f"Address {caller_address} does not exist in blockchain"}
    
    if(user_address not in web3.eth.accounts):
        return {"status":0,"output":f"Address {user_address} does not exist in blockchain"}

    try:
        smart_contract.functions.revoke(user_address).transact({"from":caller_address})
        return {"status":1,"output":f"Revoked {user_address} successfully."}
    
    except Exception as e:
        return {"status":0,"output":e}
    
def check_authorize(caller_address:str) -> dict:
    global smart_contract
    if(caller_address not in web3.eth.accounts):
        return {"status":0,"output":f"Address {caller_address} does not exist in blockchain"}
    
    result = smart_contract.functions.check_authorize(caller_address).call()
    if(result):
        return {"status":1,"output":f"{caller_address} have permission"}
    
    else:
        return {"status":0,"output":f"{caller_address} don't have permission"}
    