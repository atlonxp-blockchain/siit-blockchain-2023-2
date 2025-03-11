(function () {

    if (typeof (window.ethereum) == "undefined") {
        alert("Web3 provider not found, please install MetaMask!");
        return;
    }

    const authJson = [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_commonName",
                    "type": "string"
                }
            ],
            "name": "register",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "commonName",
                    "type": "string"
                }
            ],
            "name": "Registered",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "getCommonName",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "isUserActive",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    const authAddress = "0x3523C0c25706e529EFD43F1adFE3B8c305ecA340";
    const web3 = new Web3("http://localhost:8545");

    const DOM = {};
    DOM.error = $("#error");
    DOM.address = $("#address");
    DOM.authButton = $("#auth-button");
    DOM.domainName = $("#domain-name");
    DOM.privateKey = $("#private-key");
    DOM.resetButton = $("#reset-button");
    DOM.registerButton = $('#register-button');

    let isKeyValid = false;

    function init() {
        window.csr = null;
        window.account = null;
        isKeyValid = false;

        DOM.error.html("");
        DOM.error.hide();
        DOM.domainName.val(null)

        DOM.authButton.on("click", logIn);
        DOM.domainName.on("change", checkParameters);
        DOM.privateKey.on("change", checkParameters);
        DOM.resetButton.on("click", clearParameters);
        DOM.registerButton.on("click", register);

        checkParameters();
    }

    async function logIn() {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
            .catch((e) => {
                console.error(e.message);
            })
        if (!accounts) {
            return;
        }
        try {
            await getDomainName(accounts);
        } catch (e) {
            console.error(e);
            return;
        }
        updateAccountInfo(accounts);

        DOM.privateKey.removeAttr("disabled");

        DOM.authButton.html("Disconnect");
        DOM.authButton.removeClass("btn-success");
        DOM.authButton.addClass("btn-outline-danger");
        setTimeout(() => {
            DOM.authButton.off("click");
            DOM.authButton.on("click", logOut);
        }, 200);

        checkParameters();
    }

    async function logOut() {
        updateAccountInfo(null);
        DOM.domainName.val(null);
        DOM.privateKey.attr('disabled', 'disabled');

        DOM.authButton.html("Connect with MetaMask");
        DOM.authButton.removeClass("btn-outline-danger");
        DOM.authButton.addClass("btn-success");
        setTimeout(() => {
            DOM.authButton.off("click");
            DOM.authButton.on("click", logIn);
        }, 200);

        checkParameters();
    }

    function updateAccountInfo(account) {
        const address = (account) ? `Account: ${ethers.getAddress(account[0])}` : "";
        DOM.address.html(address);
        window.account = account;
    }

    async function getDomainName(account) {
        const authContract = new web3.eth.Contract(authJson, authAddress);

        const address = account[0];
        const domain = await authContract.methods.getCommonName(address).call();
        DOM.domainName.val(domain);
        if (domain) {
            DOM.domainName.attr("disabled", "disabled")
            alert("This account is registered");
            throw "This account is registered";
        }
        DOM.domainName.removeAttr("disabled");
    }

    function privateKeyValidate() {
        const privateKey = DOM.privateKey.val();
        if (!privateKey || !window.account) {return;}

        try {
            const wallet = new ethers.Wallet(privateKey)
            const address = ethers.getAddress(window.account[0]);
            if (wallet.address === address) {
                console.log("Key is valid")
                isKeyValid = true;
                return;
            }
        } catch (e) {
            console.error(e);
        }
        isKeyValid = false;
        alert("Invalid private key!");
    }

    function checkParameters() {
        privateKeyValidate();
        if (DOM.privateKey.val() && isKeyValid && DOM.domainName.val()) {
            DOM.registerButton.removeClass("disabled");
            return;
        }
        DOM.registerButton.addClass("disabled");
    }

    function clearParameters() {
        DOM.privateKey.val("");
        DOM.scsrFile.val("");
        checkParameters();
    }

    async function register() {
        checkParameters();
        const domainName = DOM.domainName.val();
        const privateKey = DOM.privateKey.val();

        const wallet = new ethers.Wallet(privateKey)
        const authContract = new web3.eth.Contract(authJson, authAddress);

        try {
            const response = await authContract.methods.register(domainName).send(
                {
                    from: wallet.address,
                    nonce: window.ethereum.getTransactionCount(wallet.address)
                }
            );
            console.warn(response);
        } catch (e) {
            console.error(e)
        }
        // alert("Registered")
    }

    $(init)
})();