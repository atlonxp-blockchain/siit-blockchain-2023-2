// ConnectMetaMaskButton.js
import React, { useState} from 'react';
import './componentStyle.css'
// import { ethers } from 'ethers/providers';
import contractABI from '../abi.json';

const contractAddress = '0xe7ceD56A3B8DA1bFF539a8abdbB2C40907d24388';
const { ethers } = require("ethers");

const ConnectMetaMaskButton = ({onUpdateAccount,onUpdateContract})=>{
    const [account, setAccount] = useState(null);
    const [contract,setContract] = useState(null);
    const connectToMetaMask = async () => {
      try {
        // Check if MetaMask is installed and available
        if (window.ethereum) {
          // Connect to MetaMask
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const accounts = await provider.send('eth_requestAccounts', []);


          const contractConnector = new ethers.Contract(contractAddress, contractABI, provider.getSigner());

          console.log(accounts);
          // Set the connected account
          setAccount(accounts[0]);
          onUpdateAccount(accounts[0]);

          setContract(contractConnector);
          onUpdateContract(contractConnector);

          // Other logic after connecting...
          console.log('contract is: ',contract);
        } else {
          console.error('MetaMask not detected. Please install MetaMask.');
        }
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    };
  
    return (
      <div>
        {account ? (
          <div className="tabLink">connected account: {account}</div>
        ) : (
          <li className="tabLink"  onClick={connectToMetaMask}>connect to MetaMask</li>
        )}
      </div>
    );
  
};



export default React.memo(ConnectMetaMaskButton);
