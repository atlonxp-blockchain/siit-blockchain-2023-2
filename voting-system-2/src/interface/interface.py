from web3 import Web3
from web3.exceptions import ContractLogicError
import json
import os
import warnings
import datetime
import time
from hashlib import sha256

warnings.filterwarnings("ignore")

current_path = os.path.dirname(__file__)

with open(os.path.join(current_path,"../config.json"),"r") as f:
    config = json.loads(f.read())

web3 = Web3(Web3.HTTPProvider(config["blockchain_address"]))

with open(os.path.join(current_path,f"./contract_abi.json"),"r") as f:
    contract_abi = json.loads(f.read())

with open(os.path.join(current_path,f"./contract_address.json"),"r") as f:
    contract_address = json.loads(f.read())["address"]

smart_contract = web3.eth.contract(address=contract_address,abi=contract_abi)

def timestamp_to_date_string(timestamp):
    # Convert timestamp to struct_time
    time_struct = time.localtime(timestamp)

    # Format struct_time as a string
    date_string = time.strftime("%A, %B %d, %Y %I:%M:%S %p", time_struct)

    return date_string

def create_poll(question: str, options: list[str], image_Url: str) -> dict:
    timestamp = int(datetime.datetime.now().timestamp())
    pollId = sha256((question + str(timestamp)).encode()).hexdigest()
    try:
        smart_contract.functions.createPoll(question,options,image_Url,timestamp,pollId).transact({"from":web3.eth.accounts[0]})
        return {"status":1,"output":f"create pollID {pollId} successfully"}
    
    except Exception as e:
        return {"status":0,"output":f"Unable to create poll: {e}"}
    
def close_poll(poll_ID: str) -> dict:
    try:
        smart_contract.functions.closePoll(poll_ID).transact({"from": web3.eth.accounts[0]})
        return {"status": 1, "output": f"Closed pollID {poll_ID} successfully"}

    except Exception as e:
        return {"status": 0, "output": f"Unable to close poll: {e}"}
    
def cast_vote(poll_ID: str, option_index: int) -> dict:
    try:
        smart_contract.functions.castVote(poll_ID, option_index).transact({"from": web3.eth.accounts[0]})
        return {"status": 1, "output": f"Vote cast for pollID {poll_ID} successfully"}

    except Exception as e:
        return {"status": 0, "output": f"Unable to cast vote: {e}"}


def view_poll(poll_ID:str) -> dict:
    result = smart_contract.functions.viewPoll(poll_ID).call()
    if(result[0] == "0x0000000000000000000000000000000000000000"): # It mean this poll ID do not exist
        return {"status":0,"output":[]}
    else:
        formatted_creationTime = timestamp_to_date_string(result[4])
        return {"status":0,"output":{
            "creator":result[0],
            "question":result[1],
            "options":result[2],
            "isClosed":result[3],
            "creationTime":result[4],   
            "formatCreationTime":formatted_creationTime,
            "imageUrl":result[5]
        }}

def poll_list() -> dict:
    list=[]
    idresult = smart_contract.functions.getPollList().call()
    print(idresult)
    for i in idresult:
        result = smart_contract.functions.viewPoll(i).call()
        print(result)
        list.append(result)
    return {"status":1,"output":list}
