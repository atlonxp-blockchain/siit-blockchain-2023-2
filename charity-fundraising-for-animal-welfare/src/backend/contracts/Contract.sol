// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract AnimalWelfareFund {
    uint256 totalDonations;
    address payable public owner;
    uint256 public monthlyDonationPool;
    uint256 public lastWithdrawalMonth;

    modifier onlyCreator() {
        require(msg.sender == owner, "Only the project creator can call this function");
        _;
    }

    constructor() payable {
        owner = payable(msg.sender);
        lastWithdrawalMonth = block.timestamp / 30 days; 
    }

    event MakeDonation (
        address indexed from,
        uint256 timestamp,
        string usermessage,
        string username,
        uint256 amount
    );

    struct Donation {
        address sender;
        string usermessage;
        string username;
        uint256 timestamp;
        uint256 amount;
    }

    Donation[] donations;

    function getAllDonations() public view returns (Donation[] memory) {
        return donations;
    }

    function getTotalDonations() public view returns (uint256) {
        return totalDonations;
    }

    function donateToAnimalWelfare(
        string memory _usermessage,
        string memory _username
    ) payable public {
        require(msg.value > 0, "Donation amount invalid");

        totalDonations += 1;
        donations.push(Donation(msg.sender, _usermessage, _username, block.timestamp, msg.value));

        (bool success,) = owner.call{value: msg.value}("");
        require(success, "Try Again please XD");

        emit MakeDonation(msg.sender, block.timestamp, _usermessage, _username, msg.value);
    }

    function donateMonthlyToAnimalWelfare(
        string memory _usermessage,
        string memory _username
    ) payable public {
        require(msg.value > 0, "Donation amount invalid");

        // Check if a new month has started
        uint256 currentMonth = block.timestamp / 30 days;
        if (currentMonth > lastWithdrawalMonth) {
            // Withdraw accumulated funds to the owner
            _withdraw();
        }

        totalDonations += 1;
        donations.push(Donation(msg.sender, _usermessage, _username, block.timestamp, msg.value));

        // Add the donation to the monthly pool
        monthlyDonationPool += msg.value;

        emit MakeDonation(msg.sender, block.timestamp, _usermessage, _username, msg.value);
    }

    function withdraw() external onlyCreator {
        require(monthlyDonationPool > 0, "No funds to withdraw");
        
        // Withdraw funds to the project creator's address
        payable(owner).transfer(monthlyDonationPool);
        
        // Reset the monthly donation pool
        monthlyDonationPool = 0;
        lastWithdrawalMonth = block.timestamp / 30 days;
    }

    function _withdraw() private onlyCreator {
        require(monthlyDonationPool > 0, "No funds to withdraw");
        
        // Withdraw funds to the project creator's address
        payable(owner).transfer(monthlyDonationPool);
        
        // Reset the monthly donation pool
        monthlyDonationPool = 0;
        lastWithdrawalMonth = block.timestamp / 30 days;
    }
}
