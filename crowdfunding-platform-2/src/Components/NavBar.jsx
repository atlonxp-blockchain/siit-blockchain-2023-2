import React, { useContext, useState } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";

const NavBar = () => {
  const { currentAccount, connectWallet } = useContext(CrowdFundingContext);

  return (
    <div className="backgroundMain">
      <div className="px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div className="relative flex items-center justify-between">
          <div>
            <a
              href="/"
              aria-label="Company"
              title="Company"
              className="inline-flex items-center"
            >
              <img
              src="https://e7.pngegg.com/pngimages/743/485/png-clipart-jigsaw-puzzles-animal-block-puzzle-strategy-puzzle-background-miscellaneous-game.png"
              alt="Logo"
              className="w-16 h-12"
              />
              <span className="ml-2 text-xl font-bold tracking-wide text-gray-100 uppercase">
                JIGSAWFUND
              </span>
            </a>
          </div>
          {!currentAccount && (
            <div>
              <button
                onClick={() => connectWallet()}
                className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none background"
                aria-label="Connect Wallet"
                title="Connect Wallet"
              >
                Connect Wallet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
