import sys, os, json, time
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), './smart_contract'))
sys.path.append(parent_dir)

from smart_contract import deploy_contract,land_list_interface,land_doc_interface
from web3 import Web3
current_path = os.path.dirname(__file__)

with open(os.path.join(current_path,"./config.json"),"r") as f:
    config = json.loads(f.read())

web3 = Web3(Web3.HTTPProvider(config["blockchain_address"]))
authorized_list = web3.eth.accounts[:3]
deploy_contract.deploy_land_list(web3.eth.accounts[0],authorized_list)

print("Deploy master contract successfully")

