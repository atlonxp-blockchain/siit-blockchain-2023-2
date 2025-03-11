// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        address[] donators;
        uint256[] donations;
        bool isClosed;
    }
    mapping(uint256 => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;

    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];
        require(campaign.deadline < block.timestamp, "Deadline should be a dead in the future");

        //update
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;

        numberOfCampaigns++;
        return numberOfCampaigns - 1;
    }

    function donateToCampaign (uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
        (bool sent,) = payable(campaign.owner).call{value: amount}("");

        if(sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }
    }

    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        return (campaigns [_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }
        return allCampaigns;
    }

    function updateCampaign(uint256 _id, string memory _description, uint256 _target, uint256 _deadline) public {
        require(campaigns[_id].owner == msg.sender, "You are not the owner of this campaign");
        require(_deadline > block.timestamp, "Deadline should be in the future");

        Campaign storage campaign = campaigns[_id];
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
    }

    function closeCampaign(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];

        require(campaign.owner == msg.sender, "You are not the owner of this campaign");

        if (campaign.amountCollected >= campaign.target) {
            uint256 remainingBalance = address(this).balance - campaign.amountCollected;
            (bool success, ) = payable(campaign.owner).call{value: remainingBalance}("");
            require(success, "Transfer failed");
            
            campaign.amountCollected = campaign.target;
            campaign.isClosed = true;
        } else if (campaign.deadline < block.timestamp) {
            uint256 remainingFunds = campaign.target - campaign.amountCollected;
            (bool transferSuccess, ) = payable(campaign.owner).call{value: remainingFunds}("");
            require(transferSuccess, "Transfer failed");

            campaign.isClosed = true; 
        }
    }
}