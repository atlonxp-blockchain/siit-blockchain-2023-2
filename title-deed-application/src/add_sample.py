
import sys, os, json, time
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), './smart_contract'))
sys.path.append(parent_dir)

from smart_contract import deploy_contract,land_list_interface,land_doc_interface
from web3 import Web3
current_path = os.path.dirname(__file__)

with open(os.path.join(current_path,"./config.json"),"r") as f:
    config = json.loads(f.read())

web3 = Web3(Web3.HTTPProvider(config["blockchain_address"]))
with open(os.path.join(current_path,"./sample_data.json"),"r") as f:
    sample_data = json.loads(f.read())

for key,value in sample_data.items():
    sample_data[key]["account_address"] = eval(sample_data[key]["account_address"])
    sample_data[key]["authorized_list"] = eval(sample_data[key]["authorized_list"])
    
    transfers = sample_data[key]["transfer"]
    for transfer in transfers:
        transfer[0] = eval(transfer[0])

    parcels = sample_data[key]["parcel"]
    for parcel in parcels:
        parcel[0] = eval(parcel[0])

    result = deploy_contract.deploy_land_contract(
        value["account_address"],
        value["authorized_list"],
        value["national_ID"],
        value["land_size"],
        value["holder_name"],
        value["coordinates"],
        value["land_address"],
        value["land_size_manual"]
    )

    print(result)

    select_contract = land_doc_interface.select_contract(int(key))
    print(select_contract)

    for i in value["parcel"]:
        change_result = land_doc_interface.change_region(i[0],i[1],i[2],i[3])
        print(change_result)

    for i in value["transfer"]:
        transfer_result = land_doc_interface.transfer(i[0],i[1],i[2])
        print(transfer_result)
