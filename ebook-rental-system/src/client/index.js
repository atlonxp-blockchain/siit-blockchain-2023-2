import configurationPub from '../build/contracts/PublisherManagement.json'
import configuration from '../build/contracts/UserRegistration.json';
import configurationRent from '../build/contracts/EbookRental.json';
import configurationPayment from '../build/contracts/PaymentSystem.json';

const address = configuration.networks['5777'].address;
const abi = configuration.abi;

const pubAddress = configurationPub.networks['5777'].address;
const pubAbi = configurationPub.abi;

const rentAddress = configurationRent.networks['5777'].address;
const rentAbi = configurationRent.abi;

const payAddress = configurationPayment.networks['5777'].address;
const payAbi = configurationPayment.abi;

document.addEventListener("DOMContentLoaded", function (event) {
    if (window.ethereum) {
        let accounts;
        ethereum.request({ method: "eth_requestAccounts" })
            .then((response) => {
                accounts = response[0];
                console.log('response[0] =', response[0])
            })
            .catch((err) => console.error(err.message));

        ethereum.on("chainChanged", () => window.location.reload());

        ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
                window.location.href = './register.html';
                console.log(`Using account`, accounts[0]);
            } else {
                console.error("0 account");
            }
        });

        ethereum.on("message", (message) => console.log(message));
        ethereum.on("connect", (info) => {
            console.log(`Connected to network ${info}`);
        });
        ethereum.on("disconnect", (error) => {
            console.log(`Disconnected from network ${error}`);
        });


        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const signer = provider.getSigner();

        const UserRegistrationContract = new ethers.Contract(address, abi, signer);
        const PublisherManagement = new ethers.Contract(pubAddress, pubAbi, signer);
        const ebookRentalContract = new ethers.Contract(rentAddress, rentAbi, signer);
        const PaymentContract = new ethers.Contract(payAddress, payAbi, signer);


//============================================================================================================

        if (document.getElementById('indexPage')) {

            document.getElementById('tokenPrice').addEventListener('click', async () => {
                const response = await ethereum.request({ method: "eth_requestAccounts" });
                const accounts = response[0];
                const publisher = '0x1209cBDa74A9CE28936a61195AeE83Bf22b103B8';
                const bid = 1;
                // await PublisherManagement.addBookList(1, "Book1", "Description", "Author", 100, { from: publisher });

                const user = await UserRegistrationContract.users(accounts);
                console.log('from users -> ', user);

                const isUserRegistered = await UserRegistrationContract.checkIsRegistered({ from: accounts });
                console.log('from isUserRegistered -> ', isUserRegistered);

                // UserRegistrationContract.checkIsRegistered({ from: accounts })
                //     .then(() => { ebookRentalContract.rentBook( bid,publisher, { from: accounts })})
                //     .catch((error)=> console.log('rent error: ', error))
                if (!isUserRegistered) {
                    // window.location.href = "./register.html";
                } else {
                    console.log(isUserRegistered);
                    // window.location.href = "./log_in.html"
                    let demoBookid = 1;
                    const renting = async (bid,publisher,acc) => {
                        try {
                            console.log('acc', acc);
                            const doRenting = await ebookRentalContract.rentBook(bid,publisher, { from: acc });
                            console.log('Renting result:', doRenting);
                            // Handle success
                        } catch (error) {
                            if (error.message.includes("User is not registered")) {
                                console.error("User is not registered");
                                // Handle the case where the user is not registered
                            } else {
                                console.error('Renting failed:', error.message);
                                // Handle other errors
                            }
                        }
                    }
        
                    renting(demoBookid,publisher,accounts);
                }

            })

            document.getElementById('profileBtn').addEventListener('click', async () => {
                const response = await ethereum.request({ method: "eth_requestAccounts" });
                const accounts = response[0];
                const user = await UserRegistrationContract.users(accounts);
                console.log('from users -> ', user.isRegistered);
                let isRegistered = user.isRegistered;

                if (!isRegistered) {
                    window.location.href = "./register.html"
                } else {
                    console.log(isRegistered);
                    window.location.href = "./shelf.html"
                }
            })

        }
//============================================================================================================

        if (document.getElementById('registerPage')) {
            document.getElementById('submitRegister').addEventListener('click', async function () {
                console.log('submit register click');
                // const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                const response = await ethereum.request({ method: "eth_requestAccounts" });
                const accounts = response[0];

                try {
                    let username = document.getElementById('regUsername').value;
                    let email = document.getElementById('regEmail').value;
                    let password = document.getElementById('regPass').value;
                    console.log('reg input ->', username, '//', email, '//', password);
                    const result = await UserRegistrationContract.registerUser(username, email, password, { from: accounts });

                    console.log("User registered:", result);
                    window.location.href = "./index.html";
                    // Handle events if needed
                    UserRegistrationContract.events.UserRegistered({}, (error, event) => {
                        if (!error) {
                            console.log("User Registered Event:", event.returnValues);
                        } else {
                            console.error("Error fetching events:", error);
                        }
                    });
                } catch (error) {
                    let username = document.getElementById('regUsername').value;
                    let email = document.getElementById('regEmail').value;
                    let password = document.getElementById('regPass').value;
                    console.log("Error registering user:", error);

                    if (error.data.message == 'VM Exception while processing transaction: revert Username cannot be empty') {
                        if (username == '') {
                            document.getElementById('regUsername').classList.add('is-invalid');
                            document.getElementById('usernameLabel').classList.add('text-danger');
                            document.getElementById('usernameLabel').innerHTML = 'please enter username';
                            // window.location.href = "./log_in.html"
                        }
                        if (email == '') {
                            document.getElementById('regEmail').classList.add('is-invalid');
                            document.getElementById('emailLabel').classList.add('text-danger');
                            document.getElementById('emailLabel').innerHTML = 'please enter email';
                            // window.location.href = "./log_in.html"
                        }
                        if (password == '') {
                            document.getElementById('regPass').classList.add('is-invalid');
                            document.getElementById('passLabel').classList.add('text-danger');
                            document.getElementById('passLabel').innerHTML = 'please enter password';
                            // window.location.href = "./log_in.html"
                        }
                    }

                    else if (error.data.message == 'VM Exception while processing transaction: revert User is already registered') {
                        window.location.href = "./log_in.html"
                    }
                }
            })
        }
//============================================================================================================

        if (document.getElementById('submitLogin')) {
            document.getElementById('submitLogin').addEventListener('click', () => {
                window.location.href = "./index.html"
            })
        }
//============================================================================================================
        if (document.getElementById("shelfPage")) {
            ethereum.request({ method: "eth_requestAccounts" })
                .then((response) => {
                    const accounts = response[0];
                    const getUsername = async (acc) => {
                        try {
                            const user = await UserRegistrationContract.users(acc);
                            console.log('from users -> ', user);
                            return user;
                        } catch (error) {
                            console.error('Error:', error.message);
                            return null;
                        }
                    };
        
                    getUsername(accounts).then((user) => {
                        document.getElementById('pUsername').textContent = user.username;
                        document.getElementById('pEmail').textContent = user.email;
                    });

                    const getPublisher = async(acc) => {
                        try {
                            const pub = await PublisherManagement.publishers(acc);
                            console.log('[publishers] ->', pub)
                            return pub;
                        } catch (error) {
                            console.error('Error:', error.message);
                            return null;
                        }
                    }
                    getPublisher(accounts).then((publisher) => {
                        document.getElementById('pPublisher').textContent = publisher.name;
                        document.getElementById('pPubContact').textContent = publisher.contactDetails;
                    })
                })

            document.getElementById("btnLogout").addEventListener("click", () => {
                window.location.href = "./register.html"
            });

            document.getElementById('btnUpdate').addEventListener("click", () => {
                window.location.href = "./update.html"
            })

            document.getElementById('btnPublisher').addEventListener("click", () => {
                // document.getElementById('btnPublisher').textContent = 'edit publisher'
                window.location.href = "./publisherReg.html"
            })
        }
//============================================================================================================

        if (document.getElementById('pubRegPage')) {
            ethereum.request({ method: "eth_requestAccounts" })
            .then((response) => {
                const accounts = response[0];
                
                const getPublisher = async(acc) => {
                    try {
                        const pub = await PublisherManagement.publishers(acc);
                        console.log('[publishers] ->', pub)
                        return pub;
                    } catch (error) {
                        console.error('Error:', error.message);
                        return null;
                    }
                }
                getPublisher(accounts).then((publisher) => {
                    document.getElementById('pubName').value = publisher.name;
                    document.getElementById('pubContact').value = publisher.contactDetails;
                })

                document.getElementById('submitPubRegister').addEventListener('click', async () => {
                    let name = document.getElementById('pubName').value;
                    let contact = document.getElementById('pubContact').value;
                    try {
                        console.log('update pub input->',name,'//',contact);
    
                        const result = await PublisherManagement.registerPublisher(name, contact, {from: accounts});
    
                        console.log("publisher registered:", result);
                        window.location.href = "./shelf.html";
    
                    } catch (error) {
                        console.log('create publisher error:', error);
                        if (error.data.message == 'VM Exception while processing transaction: revert Name is require') {
                            if (name == '') {
                                document.getElementById('pubName').classList.add('is-invalid');
                                document.getElementById('pubNameLabel').classList.add('text-danger');
                                document.getElementById('pubNameLabel').innerHTML = 'please enter publisher name';
                            }
                            if (contact == '') {
                                document.getElementById('pubContact').classList.add('is-invalid');
                                document.getElementById('pubContactLabel').classList.add('text-danger');
                                document.getElementById('pubContactLabel').innerHTML = 'please enter contact details';
                            }
                        }
                    }
                })
            })
        }

//============================================================================================================

        if (document.getElementById('updatePage')) {
            ethereum.request({ method: "eth_requestAccounts" })
            .then((response) => {
                const accounts = response[0];
                const getUsername = async (acc) => {
                    try {
                        const user = await UserRegistrationContract.users(acc);
                        console.log('from users -> ', user);
                        return user;
                    } catch (error) {
                        console.error('Error:', error.message);
                        return null;
                    }
                };
    
                getUsername(accounts).then((user) => {
                    document.getElementById('updUsername').value = user.username;
                    document.getElementById('updEmail').value = user.email;
                    document.getElementById('updPass').value = user.passwordHash;
                });

                document.getElementById('submitUpdate').addEventListener('click', () => {
                    let newUsername = document.getElementById('updUsername').value;
                    let newEmail = document.getElementById('updEmail').value;
                    let newPass = document.getElementById('updPass').value;
    
                    console.log('update ->', newUsername, '//', newEmail, '//', newPass);
    
                    const updating = async (newUsername, newEmail, newPass, address) => {
                        try {
                            const res = await UserRegistrationContract.updateProfile(newUsername, newEmail, newPass, { from: address });
                            console.log('update result', res);
                        } catch (error) {
                            console.log('updating fail :', error);
    
                        }
                    }

                    updating(newUsername, newEmail, newPass, accounts).then(() => {
                        window.location.href = "./shelf.html";
                    })
                })


            })

        }

    } else {
        console.error("Install metamask");
    }
})




