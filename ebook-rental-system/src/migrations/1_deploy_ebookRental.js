const UserRegistration = artifacts.require("UserRegistration");
const PublisherManagement = artifacts.require("PublisherManagement");
const PaymentSystem = artifacts.require("PaymentSystem");
const EbookRental = artifacts.require("EbookRental");

module.exports = async function (deployer, network, accounts) {
  // Deploy UserRegistration
  await deployer.deploy(UserRegistration);
  const userRegistrationInstance = await UserRegistration.deployed();

  // Deploy PublisherManagement
  await deployer.deploy(PublisherManagement);
  const publisherManagementInstance = await PublisherManagement.deployed();

  // Deploy PaymentSystem
  await deployer.deploy(PaymentSystem);
  const paymentSystemInstance = await PaymentSystem.deployed();

  // Link and deploy EbookRental
  await deployer.deploy(EbookRental, UserRegistration.address, PublisherManagement.address, PaymentSystem.address);

};