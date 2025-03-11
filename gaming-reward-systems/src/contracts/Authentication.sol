// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Authentication {
    struct user_detail {
        address addr;
        string name;
        bytes32 password;
        bool isLoggedIn;
    }

    mapping(address => user_detail) user;

    function register(
        address _address,
        string memory _name,
        string memory _password
    ) public returns (bool) {
        user[_address].addr = _address;
        user[_address].name = _name;
        user[_address].password = (keccak256(abi.encodePacked(_password)));
        user[_address].isLoggedIn = false;

        return true;
    }

    function login(
        address _address,
        string memory _password
    ) public returns (bool) {
        if (
            (keccak256(abi.encodePacked(_password))) == user[_address].password
        ) {
            user[_address].isLoggedIn = true;
            return user[_address].isLoggedIn;
        } else {
            return false;
        }
    }

    function checkLogIn(address _address) public view returns (bool) {
        return user[_address].isLoggedIn;
    }

    function logout(address _address) public returns (bool) {
        require(user[_address].isLoggedIn == true, "User did not login");
        user[_address].isLoggedIn = false;
        return true;
    }
}
