const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrowdFunding", function () {
  let crowdFunding;
  let owner;
  let donor;

  before(async () => {
    // Deploy the CrowdFunding contract before running the tests
    const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
    crowdFunding = await CrowdFunding.deploy();
    await crowdFunding.deployed();

    // Get accounts from Hardhat
    [owner, donor] = await ethers.getSigners();
  });

  it("Should create a campaign", async function () {
    const title = "Campaign Title";
    const description = "Campaign Description";
    const target = ethers.utils.parseEther("1");
    const deadline = Math.floor(Date.now() / 1000) + 3600; // One hour from now

    const createTx = await crowdFunding.createCampaign(owner.address, title, description, target, deadline);
    await createTx.wait();

    const campaign = await crowdFunding.campaigns(0);
    expect(campaign.owner).to.equal(owner.address);
    expect(campaign.title).to.equal(title);
    expect(campaign.description).to.equal(description);
    expect(campaign.target).to.equal(target);
    expect(campaign.deadline).to.equal(deadline);
    expect(campaign.amountCollected).to.equal(ethers.utils.parseEther("0"));
    expect(campaign.isClosed).to.equal(false);
  });

  it("Should donate to a campaign", async function () {
    const donationAmount = ethers.utils.parseEther("0.5");

    const donateTx = await crowdFunding.connect(donor).donateToCampaign(0, { value: donationAmount });
    await donateTx.wait();

    const [donators, donations] = await crowdFunding.getDonators(0);

    // Check if the donor address is included
    expect(donators).to.include(donor.address);

    // Check if the donation amount is close to the expected value
    const expectedDonationAmount = ethers.utils.parseEther("0.5");
    const donationIndex = donators.indexOf(donor.address);
    expect(donations[donationIndex]).to.be.closeTo(expectedDonationAmount, ethers.utils.parseEther("0.0001"));
  });

  it("Should retrieve a list of campaigns", async function () {
    const campaignsList = await crowdFunding.getCampaigns();
    expect(campaignsList).to.be.an("array");
    expect(campaignsList).to.have.lengthOf.at.least(1);
  });
  
  it("Should update a campaign", async function () {
    const newDescription = "Updated Campaign Description";
    const newTarget = ethers.utils.parseEther("2");
    const newDeadline = Math.floor(Date.now() / 1000) + 7200; // Two hours from now

    await crowdFunding.connect(owner).updateCampaign(0, newDescription, newTarget, newDeadline);

    const updatedCampaign = await crowdFunding.campaigns(0);
    expect(updatedCampaign.description).to.equal(newDescription);
    expect(updatedCampaign.target).to.equal(newTarget);
    expect(updatedCampaign.deadline).to.equal(newDeadline);
  });

});
