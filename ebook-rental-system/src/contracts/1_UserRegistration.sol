
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserRegistration {
    address public owner;

    struct User {
        bool isRegistered;
        string username;
        string email;
        string passwordHash;
    }

    mapping(address => User) public users;

    event UserRegistered(address indexed userAddress, string username, string email);
    event UserProfileUpdated(address indexed userAddress, string newUsername, string newEmail);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier notRegistered() {
        require(!users[msg.sender].isRegistered, "User is already registered");
        _;
    }

    // Declare the checkIsRegistered function
    function checkIsRegistered() public view returns (bool) {
        return users[msg.sender].isRegistered;
    }

    modifier isRegistered() {
        require(checkIsRegistered(), "User is not registered");
        _;
    }

    modifier verifyPassword(string memory _password) {
        require(
            sha256(abi.encodePacked(_password)) == sha256(abi.encodePacked(users[msg.sender].passwordHash)),
            "Incorrect password"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerUser(
        string memory _username,
        string memory _email,
        string memory _passwordHash
    ) external notRegistered {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(bytes(_passwordHash).length > 0, "Password hash cannot be empty");

        users[msg.sender] = User({
            isRegistered: true,
            username: _username,
            email: _email,
            passwordHash: _passwordHash
        });

        emit UserRegistered(msg.sender, _username, _email);
    }

    function updateProfile(
        string memory _newUsername,
        string memory _newEmail,
        string memory _password
    ) external isRegistered verifyPassword(_password) {
        require(bytes(_newUsername).length > 0, "New username cannot be empty");
        require(bytes(_newEmail).length > 0, "New email cannot be empty");

        users[msg.sender].username = _newUsername;
        users[msg.sender].email = _newEmail;

        emit UserProfileUpdated(msg.sender, _newUsername, _newEmail);
    }
}

