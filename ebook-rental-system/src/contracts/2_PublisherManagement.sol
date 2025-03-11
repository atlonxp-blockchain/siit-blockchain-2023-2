// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PublisherManagement {
    struct Publisher {
        string name;
        string contactDetails;
        mapping(uint => Book) books;
    }
    struct Book {
        string name;
        string description;
        string authorName;
        uint price;
        bool isRented; 
    }


    mapping(address => Publisher) public publishers;

    event PublisherRegistered(address indexed publisherAddress);
    event BookAdded(
        address indexed publisherAddress,
        uint indexed bookId,
        string name,
        string description,
        string authorName,
        uint price
    );

    function registerPublisher(
        string memory _name,
        string memory _contactDetails
    ) public {
        require(bytes(_name).length > 0, "Name is require");
        require( bytes(_contactDetails).length > 0, "Contract details are require");

        publishers[msg.sender].name = _name;
        publishers[msg.sender].contactDetails = _contactDetails;

        emit PublisherRegistered(msg.sender);
    }

    function addBookList(
        uint _bookId,
        string memory _name,
        string memory _description,
        string memory _authorName,
        uint _price
    ) public {
        require(bytes(_name).length > 0, "Name is required");
        require(bytes(_description).length > 0, "Description is required");
        require(bytes(_authorName).length > 0, "Author name is required");
        require(_price > 0, "Price must be greater than zero");

        Publisher storage publisher = publishers[msg.sender];

        Book storage book = publisher.books[_bookId];
        book.name = _name;
        book.description = _description;
        book.authorName = _authorName;
        book.price = _price;

        emit BookAdded(msg.sender, _bookId, _name, _description, _authorName, _price);
    }

    function getBookInfo(
        address _publisherAddress,
        uint _bookId
    ) public view returns (string memory, string memory, string memory, uint) {
        Book storage book = publishers[_publisherAddress].books[_bookId];
        return (book.name, book.description, book.authorName, book.price);
    }
    // Inside PublisherManagement.sol

    function updateBookAvailability(address _publisherAddress, uint _bookId, bool _isRented) public {
        require(msg.sender == _publisherAddress, "Unauthorized to update book availability");
        publishers[_publisherAddress].books[_bookId].isRented = _isRented;
    }

}