// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract GameCurrency {
    string name;

    mapping(address => uint) public balanceOf;

    constructor(string memory _name, uint _initialSupply) {
        name = _name;
        balanceOf[msg.sender] = _initialSupply;
    }

    function transfer(address to, uint value) external returns (bool) {
        require(value <= balanceOf[msg.sender], "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        return true;
    }

    function deposit(uint value) external returns (bool) {
        balanceOf[msg.sender] += value;
        return true;
    }

    function withdraw(uint value) external returns (bool) {
        require(value <= balanceOf[msg.sender], "Insufficient balance");
        balanceOf[msg.sender] -= value;
        return true;
    }

    function checkBalance() external view returns (uint) {
        return balanceOf[msg.sender];
    }
}
