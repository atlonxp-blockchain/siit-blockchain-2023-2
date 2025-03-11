import base64
import datetime
import json
from hashlib import sha256

import eth_keys
import eth_utils
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, serialization
from eth_account.messages import encode_defunct
from flask import Flask, render_template, request, Response
from web3 import Web3

from web3_handler import contract_cert, w3, contract_auth

app = Flask(__name__)

csr_detail = None


@app.route('/')
def index():
    return 'hello', 200


@app.route('/cert', methods=['POST'])
def request_cert():
    if request.method == 'POST':
        #sender_address = request.form['form-address']
        #print(sender_address)
        #owner_account = '0xF0caeE2ef92e74f81C0F4e7b8C5881F5Ff5897E0'
        #if sender_address.lower()!= owner_account:
            #return 'You do not have permission to sign your own account', 403
        scsr_file = request.files['signed-csr-file']
        scsr_data = base64.b64decode(scsr_file.stream.read()).decode("utf-8")

        scsr = json.loads(scsr_data)

        csr_bytes = scsr['csr'].encode('utf-8')

        pub_bytes = eth_utils.decode_hex(request.form['public-key'])
        public_key = eth_keys.keys.PublicKey.from_compressed_bytes(pub_bytes)

        sig_bytes = eth_utils.decode_hex(scsr['signature'])

        message = encode_defunct(csr_bytes)
        address = w3.eth.account.recover_message(message, signature=sig_bytes)

        if address != public_key.to_checksum_address():
            return "Signature verify error", 400

        if request.form['address'].lower() != public_key.to_checksum_address().lower():
            return "You are not the owner of the file", 400

        csr = x509.load_pem_x509_csr(csr_bytes, default_backend())

        with open('key/rootCA.key', 'rb') as ca_key_file:
            ca_private_key = serialization.load_pem_private_key(
                ca_key_file.read(),
                password=None,
                backend=default_backend()
            )

        with open('key/rootCA.pem', 'rb') as ca_cert_file:
            ca_cert = x509.load_pem_x509_certificate(ca_cert_file.read(), default_backend())

        cert = ((x509.CertificateBuilder()
                 .subject_name(csr.subject))
                .issuer_name(ca_cert.subject)
                .public_key(csr.public_key())
                .serial_number(x509.random_serial_number())
                .not_valid_before(ca_cert.not_valid_before)
                .not_valid_after(ca_cert.not_valid_after)
                .sign(ca_private_key, hashes.SHA256(), default_backend())
                )
        cert_pem = cert.public_bytes(encoding=serialization.Encoding.PEM)

        ca_private_key = '0x85b259cc8241df8abb813b788d3c42379cc0fa92ea6eb9c16408c0195716d00e'
        ca_account = w3.eth.account.from_key(ca_private_key)

        address = public_key.to_checksum_address()
        hashed = sha256(cert_pem).hexdigest()
        exp = round(ca_cert.not_valid_after.replace(tzinfo=datetime.timezone.utc).timestamp())
        common_name = cert.subject.get_attributes_for_oid(x509.oid.NameOID.COMMON_NAME)[0].value

        print(address, common_name, hashed, exp)

        # addCert_tx = contract_auth.functions.register().build_transaction({
        #     'from': address,
        #     'nonce': w3.eth.get_transaction_count(Web3.to_checksum_address(address)),
        # })
        addCert_tx = contract_cert.functions.addCert(address, common_name, hashed, exp).build_transaction({
            'from': ca_account.address,
            'nonce': w3.eth.get_transaction_count(Web3.to_checksum_address(ca_account.address))
        })
        signed_tx = w3.eth.account.sign_transaction(addCert_tx, private_key=ca_account.key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        w3.eth.wait_for_transaction_receipt(tx_hash)

        return Response(cert_pem, mimetype='text/plain',
                        headers={'Content-disposition': f'attachment; filename={common_name}.pem'})


@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        domain = request.form['domain-name']
        private_key_hex = request.form['private-key']

        private_key_bytes = eth_utils.decode_hex(private_key_hex)
        private_key = eth_keys.keys.PrivateKey(private_key_bytes)

        address = private_key.public_key.to_checksum_address()

        tx = contract_auth.functions.register(domain).build_transaction({
            'from': address,
            'nonce': w3.eth.get_transaction_count(address)
        })
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=private_key.to_bytes())
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        w3.eth.wait_for_transaction_receipt(tx_hash)

        return 'Registered', 201

@app.route('/revoke', methods=['POST'])

def revoke_domain():
    if request.method == 'POST':
        revoke_address = request.form['revoke-address']
        allowed_account = '0xF0caeE2ef92e74f81C0F4e7b8C5881F5Ff5897E0'
        allowed_account = allowed_account.lower()  # Replace with the allowed account address
        sender_address = request.form['form-address']
        allow_list = [allowed_account,sender_address]
        print('Sender Address:', sender_address)
        print('revoke:', revoke_address)
        # Check if the sender is the allowed account
        if sender_address.lower() not in allow_list:
            return 'You do not have permission to revoke domains', 403

        ca_private_key = '0x85b259cc8241df8abb813b788d3c42379cc0fa92ea6eb9c16408c0195716d00e'
        ca_account = w3.eth.account.from_key(ca_private_key)

        tx = contract_cert.functions.revoke(revoke_address).build_transaction({
            'from': ca_account.address,
            'nonce': w3.eth.get_transaction_count(ca_account.address)
        })
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=ca_account.key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        w3.eth.wait_for_transaction_receipt(tx_hash)

        return 'Revoked', 201

        
if __name__ == '__main__':
    app.run()
