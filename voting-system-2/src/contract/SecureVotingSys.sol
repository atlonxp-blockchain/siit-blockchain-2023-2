// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SecureVotingSys{
    
    // Structure to represent a poll
    struct Poll {
        address creator;
        string question;                // The question for the poll
        string[] options;               // Array of options for the poll
        mapping(address => uint256) votes;  // Map voter address to their vote (optionIndex + 1)
        bool isClosed;                  // Flag to indicate whether the poll is closed
        uint256 creationTime;           // Timestamp indicating when the poll was created
        mapping(uint256 => uint256) voteCounts;  // Map optionIndex to vote count
        string imageUrl;  // New field to store the image URL or IPFS hash
    }

    // Mapping of poll ID to Poll
    mapping(string => Poll) public polls;
    string[] pollList;

    // Event emitted when a new poll is created
    event PollCreated(string pollId, string question, string[] options, string imageUrl);

    // Event emitted when a vote is cast
    event VoteCast(string pollId, address indexed voter, uint256 optionIndex);

    // Event emitted when a poll is closed
    event PollClosed(string pollId);

    // Modifier to ensure that the caller is the creator of the poll
    modifier onlyPollCreator(string memory pollId) {
        require(msg.sender == polls[pollId].creator, "You are not the creator of this poll");
        _;
    }


    // Modifier to ensure the poll is open
    modifier pollIsOpen(string memory pollId) {
        require(!polls[pollId].isClosed, "Poll is closed or does not exist");
        _;
    }

    // Function to create a new poll
    function createPoll(string memory question, string[] memory options, string memory imageUrl, uint256 _timestamp, string memory _pollId) external  {

        Poll storage newPoll = polls[_pollId];
        newPoll.question = question;
        newPoll.options = options;
        newPoll.isClosed = false;
        newPoll.creationTime = _timestamp;  // Set the creation time
        newPoll.imageUrl = imageUrl;  // Set the provided image URL or IPFS hash
        newPoll.creator = msg.sender; // Set the creator's address
        pollList.push(_pollId);
        emit PollCreated(_pollId, question, options, imageUrl);
    }
    
    // Function to close a poll
    function closePoll(string memory pollId) external pollIsOpen(pollId) onlyPollCreator(pollId) {
        polls[pollId].isClosed = true;
        emit PollClosed(pollId); // Emit an event to notify poll closure
    }


    // Function to cast a vote in a poll
    function castVote(string memory pollId, uint256 optionIndex) external pollIsOpen(pollId) {
        require(optionIndex < polls[pollId].options.length, "Invalid option index");
        require(polls[pollId].votes[msg.sender] == 0, "You already voted");

        polls[pollId].votes[msg.sender] = optionIndex + 1; // Vote is stored as a non-zero value
        polls[pollId].voteCounts[optionIndex] += 1;  // Increment the vote count for the selected option
        emit VoteCast(pollId, msg.sender, optionIndex);
    }


    // Function to get the vote count for an option in a poll
    function getVoteCount(string memory pollId, uint256 optionIndex) external view returns (uint256) {
        require(optionIndex < polls[pollId].options.length, "Invalid option index");
        return polls[pollId].voteCounts[optionIndex];
    }
    
    function viewPoll(string memory pollId) public view returns(
        address, 
        string memory,
        string[] memory, 
        bool, 
        uint256, 
        string memory
        ){
        Poll storage tempPoll = polls[pollId];
        return (
            tempPoll.creator,
            tempPoll.question,
            tempPoll.options,
            tempPoll.isClosed,
            tempPoll.creationTime,
            tempPoll.imageUrl);
    }

    function getPollList() public view returns(string[] memory){
        return pollList;
    }
}
