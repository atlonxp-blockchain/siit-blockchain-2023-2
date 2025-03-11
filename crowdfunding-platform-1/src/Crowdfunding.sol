// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    // Structure to hold campaign details
    struct Campaign {
        address payable creator;
        string description;
        uint goal;
        uint pledged;
        uint end;
        bool claimed;
    }

    // Mapping of campaignId to Campaign structure
    uint numCampaigns;
    mapping(uint => Campaign) public campaigns;

    // Event to emit when a new campaign is started
    event CampaignStarted(uint campaignId, address creator, string description, uint goal, uint duration);

    // Event to emit when funds are pledged to a campaign
    event Pledged(uint campaignId, address donor, uint amount);

    // Event to emit when the creator claims funds
    event Claimed(uint campaignId);

    // Function to start a new campaign
    function startCampaign(string memory description, uint goal, uint duration) public {
        require(goal > 0, "Goal should be more than 0");
        require(duration > 0 && duration <= 30 days, "Duration should be 1 to 30 days");

        uint end = block.timestamp + duration;
        campaigns[numCampaigns] = Campaign(payable(msg.sender), description, goal, 0, end, false);
        emit CampaignStarted(numCampaigns, msg.sender, description, goal, duration);
        numCampaigns++;
    }

    // Function to pledge funds to a campaign
    function pledge(uint campaignId) public payable {
        require(campaignId < numCampaigns, "Campaign does not exist");
        Campaign storage campaign = campaigns[campaignId];
        require(block.timestamp < campaign.end, "Campaign finished");
        require(msg.value > 0, "Pledge amount must be more than 0");

        campaign.pledged += msg.value;
        emit Pledged(campaignId, msg.sender, msg.value);
    }

    // Function for the creator to claim funds after the campaign ends
    function claimFunds(uint campaignId) public {
        require(campaignId < numCampaigns, "Campaign does not exist");
        Campaign storage campaign = campaigns[campaignId];
        require(msg.sender == campaign.creator, "Not campaign creator");
        require(block.timestamp >= campaign.end, "Campaign not finished");
        require(!campaign.claimed, "Funds already claimed");
        require(campaign.pledged >= campaign.goal, "Goal not reached");

        campaign.claimed = true;
        campaign.creator.transfer(campaign.pledged);
        emit Claimed(campaignId);
    }

    // Function to get details of a specific campaign
    function getCampaign(uint campaignId) public view returns (
        address creator,
        string memory description,
        uint goal,
        uint pledged,
        uint end,
        bool claimed
    ) {
        require(campaignId < numCampaigns, "Campaign does not exist");
        Campaign storage campaign = campaigns[campaignId];
        return (
            campaign.creator,
            campaign.description,
            campaign.goal,
            campaign.pledged,
            campaign.end,
            campaign.claimed
        );
    }
}