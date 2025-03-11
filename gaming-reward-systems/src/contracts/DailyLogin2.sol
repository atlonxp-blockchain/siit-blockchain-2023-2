// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ERC20 {
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    uint256 public totalSupply;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    function _transfer(address from, address to, uint256 value) internal {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        require(balanceOf[from] >= value, "ERC20: insufficient balance");

        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
    }

    function transfer(address to, uint256 value) external returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool) {
        require(
            allowance[from][msg.sender] >= value,
            "ERC20: insufficient allowance"
        );
        allowance[from][msg.sender] -= value;
        _transfer(from, to, value);
        return true;
    }
}

contract Ownable {
    address public owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Ownable: caller is not the owner");
        _;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

contract GameToken is ERC20, Ownable {
    constructor() {
        totalSupply = 1000000 * 10 ** 18; // 1,000,000 tokens with 18 decimals
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }
}

// Define the DailyLogin contract
contract DailyLogin is Ownable {
    GameToken public gameToken;

    mapping(address => uint256) public loginDays;

    event DailyReward(address indexed player, uint256 day, uint256 reward);

    constructor(GameToken _gameToken) {
        gameToken = _gameToken;
    }

    function claimDailyReward() external {
        require(
            loginDays[msg.sender] < 7,
            "Rewards claimed for 7 days already"
        );

        uint256 reward = (loginDays[msg.sender] + 1) * 1000;

        gameToken.transfer(msg.sender, reward);

        loginDays[msg.sender]++;

        emit DailyReward(msg.sender, loginDays[msg.sender], reward);
    }
}
