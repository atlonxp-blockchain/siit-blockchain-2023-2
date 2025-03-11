// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaymentSystem {
    bool private locked = false;
    constructor() {
        locked = false;
    }

    modifier notLocked() {
        require(!locked, "Payment system is locked");
        _;
    }

    function lockPaymentSystem() external {
        locked = true;
    }

    function unlockPaymentSystem() public {
        // Implementation logic for unlocking the payment system
        // ...
    }


    function makePayment(address payable _recipient, uint _amount) external payable notLocked {
        require(msg.value == _amount, "Invalid payment");
        (bool success, ) = _recipient.call{value: msg.value}("");
        require(success, "Payment failed");
    }
}

