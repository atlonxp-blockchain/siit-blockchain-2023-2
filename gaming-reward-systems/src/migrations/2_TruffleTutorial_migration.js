// 2_deploy_contracts.js
const Authentication = artifacts.require("Authentication");
const GameCurrency = artifacts.require("GameCurrency");
const GameReward = artifacts.require("GameReward");

module.exports = async function (deployer) {
  // Deploy Authentication contract
  await deployer.deploy(Authentication);

  // Deploy GameCurrency contract with initial supply of 1000
  await deployer.deploy(GameCurrency, "MyGameCurrency", 1000);

  // Deploy GameReward contract and pass the addresses of Authentication and GameCurrency contracts
  await deployer.deploy(
    GameReward,
    Authentication.address,
    GameCurrency.address
  );
};
