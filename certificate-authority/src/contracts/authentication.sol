// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Authentication {
    struct User {
        bool isExist;
        string commonName;
    }
    mapping (address => User) users;
    mapping (string => address) owners;

    event Registered(address _user, string commonName);

    function register(string memory _commonName) external {
        require(users[msg.sender].isExist == false, "You are already registered!");
        require(owners[_commonName] == address(0), "Domain already exist");

        User memory newUser = User({isExist: true, commonName: _commonName});
        users[msg.sender] = newUser;
        owners[_commonName] = msg.sender;

        emit Registered(msg.sender, _commonName);
    }

    function isUserActive(address _user) external view returns (bool) {
        return users[_user].isExist;
    }

    function getCommonName(address _user) external view returns (string memory) {
        return users[_user].commonName;
    }
}