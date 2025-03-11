import sys, os

from flask import Flask, render_template, request, redirect, session, flash, jsonify
from web3 import Web3
from web3.exceptions import ContractLogicError, InvalidAddress
import base64
from io import BytesIO
import matplotlib.pyplot as plt
import ast

parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), './smart_contract'))
sys.path.append(parent_dir)

from smart_contract import land_doc_interface as doc_interface
from smart_contract import land_list_interface as list_interface
from smart_contract import deploy_contract

from util_lib import util_lib

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'

@app.route("/",methods=["GET"])
def index():
    alert = session.pop("alert",[])
    if alert is not None:
        return render_template("index.html",alert=alert)
    
    return render_template("index.html")

@app.route("/logout")
def logout():
    session.pop("account_address",[])
    session["alert"] = "Log out successfully"
    return redirect("/")

@app.route('/authenticate', methods=['POST'])
def authenticate():
    data = request.get_json()
    session["account_address"] = data.get('userAddress')
    session["alert"] = ""
    return jsonify({'message': 'Authentication successful'})

@app.route("/officer_homepage")
def officer_homepage():
    sheet_list = list_interface.get_sheet_list()["output"]
    sheet_list_permission = []
    for i in sheet_list:
        doc_interface.select_contract(i)
        permission_check = doc_interface.check_authorize(session["account_address"])
        if(permission_check["status"] > 0):
            sheet_list_permission.append(i)

    metadata_list = []
    for i in sheet_list_permission:
        doc_interface.select_contract(i)
        metadata_list.append(doc_interface.get_metadata()["output"])

    alert = session.pop("alert",[])
    if alert:
        return render_template("officer_homepage.html",alert=alert,metadata_list=metadata_list)
    
    return render_template("officer_homepage.html",metadata_list=metadata_list)

@app.route("/add_land_doc", methods=["POST"])
def add_land_doc():
    land_size_manual = request.form.get("manual_land") #Radio button
    if(land_size_manual != None or land_size_manual == "checked"):
        land_size_manual = True

    else:
        land_size_manual = False

    holder_title = request.form.get("holder_title")
    holder_firstname = request.form.get("holder_firstname")
    holder_middlename = request.form.get("holder_middlename")
    holder_lastname = request.form.get("holder_lastname")

    holder_name = [holder_title, holder_firstname, holder_middlename, holder_lastname]


    house_number = request.form.get("house_number")
    road = request.form.get("road")
    soi = request.form.get("soi")
    sub_district = request.form.get("sub_district")
    district = request.form.get("district")
    province = request.form.get("province")
    country = request.form.get("country")
    postal_code = request.form.get("postal_code")

    land_address = f"{house_number} {road} {soi} {sub_district} {district} {province} {country} {postal_code}"
    coordinates = request.form.get("coordinate")
    coordinates = "[" + coordinates.replace("] [", "], [") + "]"

    # Use ast.literal_eval to safely convert the string to a list
    coordinates = ast.literal_eval(coordinates)

    authorize_list = request.form.get("authorized_list")
    authorize_list = authorize_list.split()

    deploy_result = deploy_contract.deploy_land_contract(
        session["account_address"],
        authorize_list,
        int(request.form.get("national_ID")),
        float(request.form.get("land_size")),
        holder_name,
        coordinates,
        land_address,
        land_size_manual
    )

    if(deploy_result["status"] <= 0):
        session["alert"] = f"Error: {deploy_result['output']}"

    else:
        session["alert"] = f"{deploy_result['output']}"

    return redirect("/officer_homepage")

@app.route("/select_contract",methods=["POST"])
def select_contract():
    sheet_number = request.get_json().get("sheet_number")
    return jsonify(doc_interface.select_contract(sheet_number))

def image_to_base64(image_data):
    # Convert NumPy array to base64-encoded string
    image_buffer = BytesIO()
    plt.imsave(image_buffer, image_data, format="png")
    image_base64 = base64.b64encode(image_buffer.getvalue()).decode("utf-8")
    return image_base64

@app.route("/search", methods=["GET"])
def search():
    search_key = request.args.get("search_key")
    if(search_key.isdigit()):        
        result = doc_interface.select_contract(int(search_key))

        if(result["status"] <= 0):
            return render_template("search.html",metadata=None,search_key=search_key)

    else:
        return render_template("search.html",metadata=None,search_key=search_key)
    
    metadata = doc_interface.get_metadata()
    last_record = doc_interface.get_last_record()

    coordinates = last_record["output"]["coordinates"]

    image_land = util_lib.land_image(coordinates)
    image_data = image_to_base64(image_land)

    coor = ""
    for i in coordinates:
        coor += ((str(i))+" ")

    last_record["output"]["coordinates"] = coor
    last_record["output"]["land_address"] = " ".join(last_record["output"]["land_address"])
    

    if(session.get("account_address") is None):
        holder_ID = last_record["output"]["holder_national_ID"]
        holder_ID = str(holder_ID)
        new_ID = ""
        for i in range(len(holder_ID)):
            if(i in [7,8,9,10,11,12]):
                new_ID += "X"
            else:
                new_ID += holder_ID[i]

        holder_ID = new_ID
        return render_template("search.html",metadata = metadata["output"],last_record=last_record["output"],image_land=image_data)
    
    else:
        
        result = doc_interface.check_authorize(session["account_address"])
        if(result["status"] > 0):
            alert = session.pop("alert",[])
            if(alert):
                return render_template("search.html",metadata = metadata["output"],last_record=last_record["output"],image_land=image_data,permission=True,alert=alert)
            
            else:
                return render_template("search.html",metadata = metadata["output"],last_record=last_record["output"],image_land=image_data,permission=True)

        else:
            return render_template("search.html",metadata = metadata["output"],last_record=last_record["output"],image_land=image_data)
        
@app.route("/reactivate",methods=["POST"])
def reactivate():
    sheet_number = int(request.get_json().get("sheet_number"))
    doc_interface.select_contract(sheet_number)
    result = doc_interface.reactivate(session["account_address"])
    if(result["status"] > 0):
        session["alert"] = f"reactivate sheet {sheet_number} successfully"
    
    else:
        session["alert"] = f"Fail to reactivate sheet {sheet_number}: {result['output']}"
    
    return redirect(f"/search?search_key={sheet_number}")

@app.route("/cancel_document",methods=["POST"])
def cancel_document():
    sheet_number = int(request.get_json().get("sheet_number"))
    doc_interface.select_contract(sheet_number)
    result = doc_interface.cancel_document(session["account_address"])
    if(result["status"] > 0):
        session["alert"] = f"cancel sheet {sheet_number} successfully"

    else:
        session["alert"] = f"Fail to cancel sheet {sheet_number}: {result['output']}"

    return redirect(f"/search?search_key={sheet_number}")
    
@app.route("/change_region",methods=["POST"])
def change_region():
    doc_interface.select_contract(int(request.form.get("sheet_number")))
    land_size = float(request.form.get("land_size"))
    coordinates = request.form.get("coordinate")
    coordinates = "[" + coordinates.replace("] [", "], [") + "]"

    # Use ast.literal_eval to safely convert the string to a list
    coordinates = ast.literal_eval(coordinates)
    
    house_number = request.form.get("house_number")
    road = request.form.get("road")
    soi = request.form.get("soi")
    sub_district = request.form.get("sub_district")
    district = request.form.get("district")
    province = request.form.get("province")
    country = request.form.get("country")
    postal_code = request.form.get("postal_code")
    land_address = f"{house_number} {road} {soi} {sub_district} {district} {province} {country} {postal_code}"
    result = doc_interface.change_region(session["account_address"],land_size,coordinates,land_address)
    session["alert"] = result["output"]
    return redirect("/search")

@app.route("/transfer",methods=["POST"])
def transfer():
    doc_interface.select_contract(int(request.form.get("sheet_number")))
    holder_title = request.form.get("holder_title")
    holder_firstname = request.form.get("holder_firstname")
    holder_middlename = request.form.get("holder_middlename")
    holder_lastname = request.form.get("holder_lastname")

    holder_name_key = [holder_title,holder_firstname,holder_middlename,holder_lastname]
    holder_name = []
    for i in holder_name_key:
        if(i != ""):
            holder_name.append(i)

    result = doc_interface.transfer(session["account_address"],int(request.form.get("national_ID")),holder_name)
    session["alert"] = result["output"]
    
    return redirect(f"/search?search_key={int(request.form.get('sheet_number'))}")
    
@app.route("/get_log_doc",methods=["POST"])
def get_log_doc():
    doc_interface.select_contract(int(request.get_json().get("sheet_number")))
    return jsonify(doc_interface.get_log())

@app.route("/get_hold_history",methods=["POST"])
def get_hold_history():
    if(session.get("account_address") is None):
        doc_interface.select_contract(int(request.get_json().get("sheet_number")))
        return jsonify(doc_interface.get_hold_history())
    
    else:
        doc_interface.select_contract(int(request.get_json().get("sheet_number")))
        return jsonify(doc_interface.get_hold_history(show_ID=True))

@app.route("/get_parcel_history",methods=["POST"])
def get_parcel_history():
    doc_interface.select_contract(int(request.get_json().get("sheet_number")))
    return jsonify(doc_interface.get_parcel_history())

@app.route("/get_last_record",methods=["POST"])
def get_last_record():
    doc_interface.select_contract(request.get_json().get("sheet_number"))
    return jsonify(doc_interface.get_last_record())

@app.route("/authorize_doc",methods=["POST"])
def authorize_doc():
    doc_interface.select_contract(request.form.get("sheet_number"))
    user_address = request.form.get("user_address")
    return jsonify(doc_interface.authorize(session["account_address"],user_address))

@app.route("/revoke_doc",methods=["POST"])
def revoke_doc():
    doc_interface.select_contract(request.form.get("sheet_number"))
    user_address = request.form.get("user_address")
    return jsonify(doc_interface.revoke(session["account_address"],user_address))


@app.route("/get_sheet_list",methods=["POST"])
def get_sheet_list():
    return jsonify(list_interface.get_sheet_list())

@app.route("/get_contract_list",methods=["POST"])
def get_contract_list():
    return jsonify(list_interface.get_contract_list())

@app.route("/authorize_list",methods=["POST"])
def authorize_list():
    user_address = request.form.get("user_address")
    return jsonify(list_interface.authorize(session["account_address"],user_address))

@app.route("/revoke_list",methods=["POST"])
def revoke_list():
    user_address = request.form.get("user_address")
    return jsonify(list_interface.revoke(session["account_address"],user_address))

@app.route("/get_log_list",methods=["POST"])
def get_log_list():
    return jsonify(list_interface.get_log())

if __name__ == "__main__":
    app.run(debug=True)