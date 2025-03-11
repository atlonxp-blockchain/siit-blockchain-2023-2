// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract DailyRewardGame {
    address public owner;
    uint256 public rewardAmount;
    uint256 public lastRewardBlock;
    mapping(address => uint256) public playerLastClaim;

    event RewardClaimed(address indexed player, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    constructor(uint256 _rewardAmount) {
        owner = msg.sender;
        rewardAmount = _rewardAmount;
        lastRewardBlock = block.number;
    }

    function setRewardAmount(uint256 _rewardAmount) external onlyOwner {
        rewardAmount = _rewardAmount;
    }

    function claimDailyReward() external {
        require(
            playerLastClaim[msg.sender] < lastRewardBlock,
            "Already claimed today"
        );

        uint256 blocksSinceLastClaim = block.number -
            playerLastClaim[msg.sender];
        require(
            blocksSinceLastClaim >= 5760,
            "You can only claim once every 24 hours"
        ); // Assuming 15 seconds per block

        // Calculate and transfer the reward
        uint256 playerReward = calculateReward(msg.sender);
        require(playerReward > 0, "Insufficient funds for reward");

        playerLastClaim[msg.sender] = block.number;

        // Transfer reward to the player
        require(
            payable(msg.sender).send(playerReward),
            "Failed to send reward"
        );

        emit RewardClaimed(msg.sender, playerReward);
    }

    function calculateReward(address player) internal view returns (uint256) {
        // You can implement custom logic here to calculate the reward based on player's achievements, level, etc.
        return rewardAmount;
    }

    function rewardTimeout() public view returns (uint256) {
        return playerLastClaim[msg.sender];
    }

    function withdrawFunds() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
