// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./GameCurrency.sol";
import "./Authentication.sol";

contract GameReward {
    struct DailyReward {
        uint rewardNum;
        uint rewardAmount;
        uint rewardTimestamp;
    }

    DailyReward public dailyReward;

    GameCurrency public gameCurrency;
    Authentication public authentication;

    uint private current_time;

    constructor(address _authenAddress, address _gcAddress) {
        authentication = Authentication(_authenAddress);
        gameCurrency = GameCurrency(_gcAddress);
        dailyReward.rewardAmount = 1;
        dailyReward.rewardTimestamp = 0;
        dailyReward.rewardNum = 0;
    }

    function register(
        string memory username,
        string memory password
    ) public returns (bool) {
        return authentication.register(msg.sender, username, password);
    }

    function login(string memory password) public returns (bool) {
        return authentication.login(msg.sender, password);
    }

    function logout() public returns (bool) {
        return authentication.logout(msg.sender);
    }

    function checkLogin() public view returns (bool) {
        return authentication.checkLogIn(msg.sender);
    }

    function claimDailyReward() public returns (bool) {
        //It should not be block.timestamp
        require(
            block.timestamp - dailyReward.rewardTimestamp >= 1 days,
            "Reward not ready yet"
        );

        require(checkLogin(), "User did not login");

        dailyReward.rewardTimestamp = block.timestamp;

        gameCurrency.deposit(dailyReward.rewardAmount);

        dailyReward.rewardNum += 1;

        return true;
    }

    function checkBalance() public view returns (uint) {
        return gameCurrency.checkBalance();
    }
}
