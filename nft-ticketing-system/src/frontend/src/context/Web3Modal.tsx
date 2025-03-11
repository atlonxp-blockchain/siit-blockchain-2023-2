"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

// 2. Set chains
const chains = [
  {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://cloudflare-eth.com",
  },
  {
    chainId: 11155111,
    name: "Ethereum Testnet Sepolia",
    currency: "ETH",
    explorerUrl: "https://sepolia.etherscan.io",
    rpcUrl: "https://rpc.sepolia.org",
  },
  {
    chainId: 5,
    name: "Ethereum Testnet Goerli",
    currency: "ETH",
    explorerUrl: "https://goerli.etherscan.io",
    rpcUrl: "https://rpc.ankr.com/eth_goerli",
  },
];
// 3. Create modal
const metadata = {
  name: "TicketX",
  description: "TicketX",
  url: "https://mywebsite.com",
  icons: ["https://avatars.mywebsite.com/"],
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: chains,
  projectId,
  themeVariables: {
    "--w3m-accent": "#4155CC",
    "--w3m-color-mix": "#4155CC",
    "--w3m-color-mix-strength": 40,
  },
});

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  return children;
}
