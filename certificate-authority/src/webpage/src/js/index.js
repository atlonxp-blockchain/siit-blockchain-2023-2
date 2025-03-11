let userAddress = null;
(function () {

    if (typeof (window.ethereum) == "undefined") {
        alert("Web3 provider not found, please install MetaMask!");
        return;
    }

    const DOM = {};
    DOM.page = $("#page");
    DOM.error = $("#error");
    DOM.address = $("#address");
    DOM.addressForm = $("#form-address");
    DOM.authButton = $("#auth-button");
    DOM.domainName = $("#domain-name");
    DOM.privateKey = $("#private-key");
    DOM.publicKey = $("#public-key");
    DOM.csrFile = $("#csr-file");
    DOM.signedCsrFile = $("#signed-csr-file");
    DOM.csrRaw = $("#csr-raw");
    DOM.csrDetail = $("#csr-detail");
    DOM.csrPublicKey = $("#csr-public-key");
    DOM.infoBox = $("#info-box");
    DOM.resetButton = $("#reset-button");
    DOM.signButton = $('#sign-button');
    DOM.requestButton = $("#cert-request-button");
    DOM.registerButton = $("#register-button");

    function init() {
        window.csr = null;
        window.account = null;

        DOM.error.html("");
        DOM.error.hide();
        DOM.domainName.val(null)

        DOM.authButton.on("click", logIn);
        DOM.publicKey.on("change", verify);
        DOM.privateKey.on("change", verify);
        DOM.csrFile.on("change", checkSignParams);
        DOM.signedCsrFile.on("change", checkRequestParams);
        DOM.resetButton.on("click", clearParameters);
        DOM.signButton.on("click", sign)

        if (DOM.page.val() === "register") {
            DOM.domainName.on("change", checkRegisterParams);
        }

        DOM.infoBox.hide();

    }

    function verify() {
        console.warn("key changed!")
        try {checkSignParams()} catch (e) {}
        try {checkRequestParams()} catch (e) {}
        try {checkRegisterParams()} catch (e) {}
    }

    async function logIn() {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
            .catch((e) => {
                console.error(e.message);
            })
        if (!accounts) {
            return;
        }
        userAddress = accounts[0];
        updateAccountInfo(accounts);
        try {
            await getDomainName(accounts);
            DOM.error.html("")
        } catch (e) {
            console.error(e);
            DOM.error.html(e)
            DOM.error.show();
        }
        verify()
        
        DOM.privateKey.removeAttr("disabled");
        DOM.publicKey.removeAttr("disabled");

        DOM.authButton.html("Disconnect");
        DOM.authButton.removeClass("btn-success");
        DOM.authButton.addClass("btn-outline-danger");
        setTimeout(() => {
            DOM.authButton.off("click");
            DOM.authButton.on("click", logOut);
        }, 200);
    }

    async function logOut() {
        updateAccountInfo(null);
        DOM.error.html(null);
        DOM.error.hide();


        DOM.domainName.val(null);
        DOM.privateKey.attr('disabled', 'disabled');
        DOM.publicKey.attr('disabled', 'disabled');

        DOM.authButton.html("Connect with MetaMask");
        DOM.authButton.removeClass("btn-outline-danger");
        DOM.authButton.addClass("btn-success");
        setTimeout(() => {
            DOM.authButton.off("click");
            DOM.authButton.on("click", logIn);
        }, 200);
    }

    function updateAccountInfo(account) {
        let address = ""
        if (account) {
            address = `Account: ${ethers.getAddress(account[0])}`;
            DOM.addressForm.val(ethers.getAddress(account[0]));
        }
        $("#eth_address").val(address)
        DOM.address.html(address);
        window.account = account;
    }

    async function getDomainName(account) {
        const web3 = new Web3("http://localhost:8545");
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
        const authContract = new web3.eth.Contract(authJson, "0x3523C0c25706e529EFD43F1adFE3B8c305ecA340");

        const address = account[0];
        const domain = await authContract.methods.getCommonName(address).call();
        if (!domain && DOM.page.val() !== 'register') {
            alert("This account is not registered");
            throw "This account is not registered";
        }
        DOM.domainName.val(domain);
        if (domain === '' && DOM.page.val() === 'register') {
            DOM.domainName.removeAttr("disabled");
        }
    }

    function validateKey(key) {
        if (!(key && window.account)) {return; }

        const addressFromKey = ethers.computeAddress(key);
        const addressFromMeta = ethers.getAddress(window.account[0]);

        if (addressFromKey !== addressFromMeta) {
            const msg = "Key is invalid";
            alert(msg);
            console.error(msg);
            return false;
        }
        return true;
    }

    function checkSignParams() {
        const domain = DOM.domainName.val();
        const key = DOM.privateKey.val();
        const csrFile = DOM.csrFile.val();
        if (domain && key && validateKey(key) && csrFile) {
            DOM.infoBox.show();
            DOM.signButton.removeClass("disabled");
            readCsrFile(DOM.csrFile[0].files[0]);
        } else {
            DOM.infoBox.hide();
            DOM.signButton.addClass("disabled");
        }
    }

    function checkRequestParams() {
        const domain = DOM.domainName.val();
        const key = DOM.publicKey.val();
        const signedCsrFile = DOM.signedCsrFile[0].files[0];
        if (domain && key && validateKey(key) && signedCsrFile) {
            DOM.infoBox.show();
            DOM.requestButton.removeClass("disabled");
            readCsrFile(DOM.signedCsrFile[0].files[0], true);
        } else {
            DOM.infoBox.hide();
            DOM.requestButton.addClass("disabled");
        }
    }

    function checkRegisterParams() {
        const domain = DOM.domainName.val();
        const key = DOM.privateKey.val();
        console.log(domain , key , validateKey(key))
        if (domain && key && validateKey(key)) {
            DOM.registerButton.removeClass("disabled");
        } else {
            console.warn("hide button");
            DOM.registerButton.addClass("disabled");
        }
    }

    function clearParameters() {
        DOM.privateKey.val("");
        DOM.csrFile.val("");
        DOM.signedCsrFile.val("");
    }

    function readCsrFile(source, encoded=false) {
        const reader = new FileReader();

        reader.onload = (event) => {
            let result = event.target.result.toString()
            if (encoded) {
                const raw = atob(result);
                result = JSON.parse(raw)['csr'];
            }
            window.csr = result;
            DOM.csrRaw.html(result.replace(/[\r\n]/g, "<br>"));
            showCsrDetail();
        };
        reader.readAsText(source);
    }

    function showCsrDetail() {
        const csrRaw = window.csr;
        if (!csrRaw) { return; }

        const pki = forge.pki;
        const csr = pki.certificationRequestFromPem(csrRaw);

        DOM.csrDetail.html(csr.subject.attributes.map(attr => `<b>${attr.name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())}</b>: ${attr.value}`
        ).join('<br>'));

        const publicKey = forge.pki.publicKeyToPem(csr.publicKey);
        DOM.csrPublicKey.html(publicKey.replace(/\n/g, "<br>"));

        // console.log('CSR Version:', csr.version);
        // console.log('CSR Subject:', csr.subject.attributes.map(attr => `${attr.name}=${attr.value}`).join(', '));
        // console.log('CSR Public Key:', );
    }

    function sign() {
        checkSignParams();
        signCsr();
    }

    function signCsr() {
        const csrRaw = window.csr;
        const privateKey = DOM.privateKey.val();
        if (!csrRaw || !privateKey) { return; }

        const wallet = new ethers.Wallet(privateKey);
        const signature = wallet.signMessageSync(csrRaw);

        const scsr = {
            "signature": signature,
            "csr": csrRaw
        }
        const scsrString = JSON.stringify(scsr);
        const scsrFile = ethers.encodeBase64(ethers.toUtf8Bytes(scsrString, undefined))
        download(`${DOM.domainName.val()}.scsr`, scsrFile);
    }

    function download(filename, text) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('target', '_blank');
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
    
    $(init)
})();