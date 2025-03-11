import sys, os
from flask import Flask, render_template, request, redirect, session, flash, jsonify
from web3 import Web3
from web3.exceptions import ContractLogicError, InvalidAddress
import json

parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), './interface'))
sys.path.append(parent_dir)

import interface

current_path = os.path.dirname(__file__)
with open(os.path.join(current_path,"./config.json"),"r") as f:
    config = json.loads(f.read())

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret-key'

@app.route("/start_session",methods=["POST"])
def start_session():
    # Receive user information from the React frontend
    user_info = request.get_json()

    # Store user information in the Flask session
    session['user_email'] = user_info['user_email']

    return jsonify({'message': 'Session started successfully'})

@app.route("/create_poll",methods=["POST"])
def create_poll():
    request_data = request.get_json()
    question = request_data["question"]
    options = request_data["options"]
    image_Url = request_data["image_Url"]
    print(question)
    print(options)
    print(image_Url)
    
    return jsonify({"message":interface.create_poll(question,options,image_Url)})

@app.route("/close_poll", methods=["POST"])
def close_poll():
    request_data = request.get_json()
    pollId = request_data["pollId"]

    return jsonify({"message": interface.close_poll(pollId)})

@app.route("/cast_vote", methods=["POST"])
def cast_vote():
    request_data = request.get_json()
    pollId = request_data["pollId"]
    option_index = request_data["option_index"]

    return jsonify({"message": interface.cast_vote(pollId, option_index)})

@app.route("/view_poll",methods=["POST"])
def view_poll():
    request_data = request.get_json()
    pollId = request_data["pollId"]

    return jsonify({"message":interface.view_poll(pollId)})

@app.route("/poll_list",methods=["POST","GET"])
def poll_list():
    return jsonify({"message":interface.poll_list()})

if __name__ == "__main__":
    app.run(debug=True,host=config["client_address"],port=8000)
