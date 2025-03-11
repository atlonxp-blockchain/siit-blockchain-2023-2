const csrFileInput = document.getElementById('formCsrFile');
const encryptButton = document.getElementById('encrypt');

window.rawCSR = null;
csrFileInput.value = null;


function showRawCSR() {
    const rawCSR = document.getElementById('csr-raw');
    rawCSR.innerText = window.rawCSR;

    // document.getElementById('info-box').removeAttribute('hidden');
}

function showCsrDetail() {
    const csrFile = window.rawCSR;
    const csrDetail = document.getElementById('csr-detail');

    let csr = forge.pki.certificationRequestFromPem(csrFile);
    csr.subject.attributes.forEach((current) => {
        let p = document.createElement('p');
        p.innerText = current.name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase()) + ': ' + current.value;
        csrDetail.appendChild(p);
    })

    // document.getElementById('csrDetail_block').removeAttribute('hidden')
}

csrFileInput.addEventListener('change', (event) => {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (event) => {
        window.rawCSR = event.target.result.toString();
        showRawCSR();
        showCsrDetail();
        encryptButton.removeAttribute('hidden');
        document.getElementById('info-box').removeAttribute('hidden')
    }
    reader.readAsText(file);
});