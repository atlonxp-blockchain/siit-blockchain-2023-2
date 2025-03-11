// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./1_UserRegistration.sol";
import "./2_PublisherManagement.sol";
import "./3_PaymentSystem.sol";

contract EbookRental {
    UserRegistration public userRegistrationContract;
    PublisherManagement public publisherManagementContract;
    PaymentSystem public paymentSystemContract;
    address public owner;

    mapping(address => mapping(uint => bool)) public rentedBooks;
    mapping(address => mapping(uint => RentalInfo)) public userRentedBooks;

    event BookRented(
        address indexed userAddress,
        uint indexed bookId,
        string bookName,
        string authorName,
        uint rentalFee,
        uint expirationTime
    );

    event LogUserRegistrationStatus(address indexed userAddress, bool isRegistered);

    struct RentalInfo {
        bool isRented;
        uint rentalTimestamp;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor(
        address _userRegistration,
        address _publisherManagement,
        address _paymentSystem
    ) {
        owner = msg.sender;
        userRegistrationContract = UserRegistration(_userRegistration);
        publisherManagementContract = PublisherManagement(_publisherManagement);
        paymentSystemContract = PaymentSystem(_paymentSystem);
    }

    function rentBook(uint _bookId, address publisherAddress) external {
        // Ensure the user is registered
        require(userRegistrationContract.checkIsRegistered(), "User is not registered");

        // Get book information
        (string memory bookName, , string memory authorName, uint rentalFee) = publisherManagementContract.getBookInfo(publisherAddress, _bookId);

        // Check if the book is available for rent
        require(!rentedBooks[msg.sender][_bookId], "Book is already rented");

        // Process payment
        paymentSystemContract.makePayment{value: rentalFee}(payable(owner), rentalFee);

        // Record the rented book and set the expiration time to 30 days from now
        rentedBooks[msg.sender][_bookId] = true;
        userRentedBooks[msg.sender][_bookId] = RentalInfo(true, block.timestamp);

        // Update book availability (mark the book as rented)
        publisherManagementContract.updateBookAvailability(msg.sender, _bookId, true);

        // Emit the event indicating the successful rental
        emit BookRented(msg.sender, _bookId, bookName, authorName, rentalFee, block.timestamp + 30 days);
    }


    function canReadBook(address _userAddress, uint _bookId) external view returns (bool) {
        bool isUserRegistered = userRegistrationContract.checkIsRegistered();

                // Debugging statements
        if (!isUserRegistered) {
            revert("User is not registered");
        }


        return rentedBooks[_userAddress][_bookId] && block.timestamp <= userRentedBooks[_userAddress][_bookId].rentalTimestamp + 30 days;
    }

    // Unlock the payment system after the transaction is complete
    function unlockPaymentSystem() external onlyOwner {
        paymentSystemContract.unlockPaymentSystem();
    }
}
