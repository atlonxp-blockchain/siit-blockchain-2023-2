import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';


import contractABI from "./abi.json";
const contractAddress = "0x87c58703781d1f60c420Ca1966F2db72d71a8964";


// async function createPost(content){
//   const accounts = await web3.eth.getAccounts();
//   try{
//     await contract.methods.createPost(content).send({from:accounts[0]});
//   }catch(error){
//     console.error("User rejected request:", error);
//   }
// }




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
