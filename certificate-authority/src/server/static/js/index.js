window.walletAddress = null;
window.rawCSR = null;

const connectWallet = document.getElementById('connectWallet');
const walletAddress = document.getElementById('walletAddress');
const csrFileInput = document.getElementById('formCsrFile');
const requestButton = document.getElementById('requestCert');

csrFileInput.value = null;


function checkInstalled() {
    if (typeof window.ethereum == 'undefined') {
        walletAddress.innerText = 'MetaMask not installed';
        return false;
    }
    connectWallet.addEventListener('click', signInMetaMask);
}

async function signInMetaMask() {
    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
        .catch((e) => {
            console.error(e.message);
        })
    if (!accounts) {
        return;
    }

    window.walletAddress = accounts[0];
    walletAddress.innerText = window.walletAddress;

    connectWallet.innerText = 'Sign Out';
    connectWallet.className = 'btn btn-outline-danger';
    connectWallet.removeEventListener('click', signInMetaMask);
    setTimeout(() => {
        connectWallet.addEventListener('click', signOutMetaMask);
    }, 200);

    document.getElementById('address').setAttribute('value', window.walletAddress)
    document.getElementById('toolsWindow').removeAttribute('hidden');
}

function signOutMetaMask() {
    window.walletAddress = null;
    walletAddress.innerText = '';
    connectWallet.innerText = 'Connect with MetaMask';
    connectWallet.className = 'btn btn-success';

    connectWallet.removeEventListener('click', signOutMetaMask);
    setTimeout(() => {
        connectWallet.addEventListener('click', signInMetaMask);
    }, 200);

    document.getElementById('address').removeAttribute('value')
    document.getElementById('toolsWindow').setAttribute('hidden', 'hidden');
}

function showRawCSR() {
    const rawCSR = document.getElementById('rawCSR');
    rawCSR.innerText = window.rawCSR;

    document.getElementById('rawCSR_block').removeAttribute('hidden');
}

function showCsrDetail() {
    const csrFile = window.rawCSR;
    const csrDetail = document.getElementById('csrDetail');

    let csr = forge.pki.certificationRequestFromPem(csrFile);
    csr.subject.attributes.forEach((current) => {
        let p = document.createElement('p');
        p.innerText = current.name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase()) + ': ' + current.value;
        csrDetail.appendChild(p);
    })

    document.getElementById('csrDetail_block').removeAttribute('hidden')
}

csrFileInput.addEventListener('change', (event) => {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (event) => {
        window.rawCSR = JSON.parse(atob(event.target.result.toString())).csr;
        showRawCSR();
        showCsrDetail();
        requestButton.removeAttribute('hidden');
    }
    reader.readAsText(file);
});

requestButton.addEventListener('click', () => {
    console.log('submit')
});

window.addEventListener('DOMContentLoaded', () => {
    checkInstalled();
});
