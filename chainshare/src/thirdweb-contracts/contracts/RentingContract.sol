// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract RentingContract {

    uint public numberOfListing = 0;
    address private contract_owner;

    constructor() {
        contract_owner = msg.sender;
    }

    struct User {
        string profilePic;
        string name;
        uint256[] UserListing;
        uint256[] renting;
        string[] reviews;
        address[] reviewers;
        uint256[] scores;
        uint256 balance;
        uint256 hold;
    }

    struct Listing {
        uint256 listingId;
        string itemName;
        string itemDescription;
        string itemPic; 
        address owner;
        address borrower;
        uint256 price;
        uint256 deposit;
        uint256 duration;
        uint256 startDate;
        uint256 endDate;
        bool isRented;
        bool isReturning;
        bool isActive;
        bool isDeleted;
        address[] history;
    } 

    mapping(address => User) private users;
    mapping(uint256 => Listing) private listings;

    receive() external payable {
        users[msg.sender].balance += msg.value;
    }

    function createListing(
        uint256 _price, 
        uint256 _deposit, 
        uint256 _duration,
        string memory _itemName,
        string memory _itemDescription, 
        string memory _itemPic
        ) public returns(uint256) {
        require(users[msg.sender].balance>_deposit/2,"Insufficient funds");
        Listing storage listing = listings[numberOfListing];

        listing.listingId = numberOfListing;
        listing.owner = msg.sender;
        listing.itemName = _itemName;
        listing.itemDescription = _itemDescription;
        listing.itemPic = _itemPic;
        listing.price = _price;
        listing.deposit = _deposit;
        listing.duration = _duration;
        listing.startDate = block.timestamp;
        listing.endDate = block.timestamp;
        listing.isActive = true;
        listing.isRented = false;
        listing.isReturning = false;
        listing.isActive = true;
        listing.isDeleted = false;

        numberOfListing++;
        users[msg.sender].balance -= _deposit/2;
        users[msg.sender].hold += _deposit/2;

        users[msg.sender].UserListing.push(numberOfListing - 1);

        return numberOfListing - 1;
    }

    function rent(uint256 _listingId) public {
        require(msg.sender != listings[_listingId].owner, "You can't rent your own item");
        require(users[msg.sender].balance >= (listings[_listingId].price + listings[_listingId].deposit), "Insufficient funds");
        require(!listings[_listingId].isRented, "The contract is already rented");
        require(listings[_listingId].isActive, "The contract is not active");
        listings[_listingId].borrower = msg.sender;
        listings[_listingId].history.push(msg.sender);
        listings[_listingId].isRented = true;
        listings[_listingId].startDate = block.timestamp;
        listings[_listingId].endDate = listings[_listingId].startDate + listings[_listingId].duration;
        users[msg.sender].balance -= (listings[_listingId].price + listings[_listingId].deposit);
        users[msg.sender].renting.push(_listingId);
    }

    function deleteListing(uint256 _listingId) public {
        require(msg.sender == listings[_listingId].owner, "Only the owner can delete the listing");
        require(!listings[_listingId].isRented, "The Item is already rented");
        require(listings[_listingId].endDate >= block.timestamp - 604800, "The Item must be inactivate for more than 1 week");
        listings[_listingId].isDeleted = true;
        users[msg.sender].balance += listings[_listingId].deposit/2;
        users[msg.sender].hold -= listings[_listingId].deposit/2;
    }

    function deactivateListing(uint256 _listingId) public {
        require(msg.sender == listings[_listingId].owner || msg.sender == address(this) , "Only the owner can deactivate the listing");
        require(!listings[_listingId].isRented, "The Item is already rented");
        listings[_listingId].isActive = false;
    }

    function activateListing(uint256 _listingId) public {
        require(msg.sender == listings[_listingId].owner, "Only the owner can deactivate the listing");
        require(!listings[_listingId].isDeleted, "The Item is already deleted");
        listings[_listingId].isActive = true;
    }

    function returnItem(uint256 _listingId, uint256 _score, string memory _reviews,bool isReview) public {
        require(msg.sender == listings[_listingId].borrower, "Only borrower can return");
        require(listings[_listingId].isRented == true, "Only rented Item can be retuned");
        require(listings[_listingId].endDate > block.timestamp, "Only unexpired renting contract can be return");
        listings[_listingId].isReturning = true;

        if (isReview) {
            users[listings[_listingId].owner].scores.push(_score);
            users[listings[_listingId].owner].reviewers.push(msg.sender);
            users[listings[_listingId].owner].reviews.push(_reviews);
        }    
    }
    //todo : pop value from rent array
    function receivedItem(uint256 _listingId) public {
        require(msg.sender == listings[_listingId].owner, "Only the owner can reciveItem");
        require(listings[_listingId].isReturning == true, "Item cant be recived");
        require(listings[_listingId].isRented == true,"Only Rented Item can be recived");
        users[msg.sender].balance += listings[_listingId].price;
        users[listings[_listingId].borrower].balance += listings[_listingId].deposit;
        
        listings[_listingId].startDate = block.timestamp;
        listings[_listingId].endDate = block.timestamp;
        listings[_listingId].isRented = false;
        listings[_listingId].isReturning = false;

        uint256 length = users[listings[_listingId].borrower].renting.length;
         for (uint256 i = 0; i < length; i++) {
            if (users[listings[_listingId].borrower].renting[i] == _listingId) {
                // Match found, delete the element from the array
                if (i < length - 1) {
                    users[listings[_listingId].borrower].renting[i] = users[listings[_listingId].borrower].renting[length - 1];
                }
                users[listings[_listingId].borrower].renting.pop();
                break; // Stop iterating after the first match
            }
        }
    }

    function withdraw(uint256 _amount) public payable returns(uint256){
        require(users[msg.sender].balance >= _amount, "Insufficient funds");
        (bool success,) = payable(msg.sender).call{value: _amount}("");
        require(success, "Transfer failed.");
        users[msg.sender].balance -= _amount;
        return users[msg.sender].balance;
    }

    function reportNotReturnItem(uint256 _listingId) public{
        require(msg.sender == listings[_listingId].owner, "Only the owner can report");
        require(listings[_listingId].isRented == true, "Only rented items can be reported");
        require(listings[_listingId].endDate < block.timestamp, "Only expired renting contract can be reported");
        require(listings[_listingId].isReturning == false, "Only non-returned item can be reported");

        users[msg.sender].balance += listings[_listingId].deposit + listings[_listingId].price;
        deactivateListing(_listingId);
    }

    //--------------------------> GetFunction <---------------------------------//

    function getUserBalance() public view returns(uint256){
        return users[msg.sender].balance;
    }

    function getUser() public view returns(User memory){
        return users[msg.sender];
    }

    function getCurrentRenting() public view returns(Listing[] memory){
        uint256 length = users[msg.sender].renting.length;
        Listing[] memory Listings = new Listing[](length);
        for (uint256 i = 0; i < length; i++) {
            Listings[i] = listings[users[msg.sender].renting[i]];
        }
        return Listings;
    }

    function getUserListing() public view returns(Listing[] memory){
        uint256 length = users[msg.sender].UserListing.length;
        Listing[] memory Listings = new Listing[](length);
        for (uint256 i = 0; i < length; i++) {
            Listings[i] = listings[users[msg.sender].UserListing[i]];
        }
        return Listings;
    }

    function getUserByAddress(address _address) public view returns(User memory){
        return users[_address];
    }

    function getActiveListings() public view returns(Listing[] memory){

        uint256 length = numberOfListing;
        Listing[] memory Listings = new Listing[](length);
        uint256 count = 0;
        for (uint256 i = 0; i < length; i++) {
            if(listings[i].isActive && !listings[i].isRented && !listings[i].isReturning && !listings[i].isDeleted){
                Listings[count] = listings[i];
                count++;
            }
        }
        return Listings;
    }

}

