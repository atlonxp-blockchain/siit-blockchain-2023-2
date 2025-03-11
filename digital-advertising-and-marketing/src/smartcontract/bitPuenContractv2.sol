// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract bitPuenContractv2 {

    uint16 public MAX_POST_LENGTH = 1000;
    
    struct Post {
        uint256 id;
        address author;
        string content;
        string imageLink;
        uint256 timestamp;
        int256 DegreeOfAppreciation;
        address[] voters;
    }   

    mapping(address => bool) public users; //users that connect
    mapping(address => Post[]) public posts; //store posts with address-Post array map
    
    address public owner;
    address[] public allUsers;  

    event postCreated(uint256 id, address author, string content, uint256 timestamp);
    event postUpVote(address upVoter,address postAuthor,uint256 postId,int256 DegreeOfAppreciation);
    event postDownVote(address upVoter,address postAuthor,uint256 postId,int256 DegreeOfAppreciation);
    event userConnected(address user);

    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "You are not the owner.");
        _;
    }

    function changePostLimit(uint16 NEW_POST_LENGTH)public onlyOwner{
        MAX_POST_LENGTH = NEW_POST_LENGTH;
    }

    function createPost(string memory _post,string memory _imageLink,uint256 _timestamp) public{ 

        // post limitations
        // require(,"You haven't login yet.");
        require(bytes(_post).length <= MAX_POST_LENGTH,"Your Post content is too long."); // Max Post Length

        if (!users[msg.sender]) {
            users[msg.sender] = true;
            allUsers.push(msg.sender);
            emit userConnected(msg.sender);
        }

        Post memory newPost = Post({
            id: posts[msg.sender].length,
            author: msg.sender,
            content: _post,
            imageLink: _imageLink,
            timestamp: _timestamp,
            DegreeOfAppreciation: 0,
            voters: new address[](0)
        });

        posts[msg.sender].push(newPost);

        emit postCreated(newPost.id,newPost.author,newPost.content,newPost.timestamp);
    }

    function isVoter(address author,uint256 id) internal view returns (bool){
        address[] memory postVoters = posts[author][id].voters;
        for (uint256 i = 0; i < postVoters.length; i++) {
            if (postVoters[i] == msg.sender) {
                return true; // User is already a voter
            }
        }
        return false; // Not vote Yet
    }



    function upVote(address author,uint256 id) external {
        require(posts[author][id].id == id,"Post does not exist.");
        require(!isVoter(msg.sender,id) , "You already upVote the post.");

        posts[author][id].DegreeOfAppreciation++;
        posts[author][id].voters.push(msg.sender);

        emit postUpVote(msg.sender,author,id,posts[author][id].DegreeOfAppreciation);
    }

    function downVote(address author,uint256 id) external {
        require(posts[author][id].id == id,"Post does not exist.");
        require(!isVoter(msg.sender,id) , "You already downVote the post.");
        // require(!isVoter(msg.sender,id) , "You haven't ");
        // require(posts[author][id].upVote > 0,"Reach 0 Vote") To limit vote to 0

        posts[author][id].DegreeOfAppreciation--;
        posts[author][id].voters.push(msg.sender);

        emit postDownVote(msg.sender,author,id,posts[author][id].DegreeOfAppreciation);
    }

    // function removeVote(address author,uint256 id) external {
    //     require(isVoter(msg.sender,id), " You haven't vote yet.");
    //     // posts[author][id].voters[];
    // }

    function getPost(uint _i) public view returns(Post memory) {
        return posts[msg.sender][_i]; //position Index of Posts
    }

    function getAllPost() public view returns (Post[] memory){
         Post[] memory allPosts;

        // Iterate over all users and retrieve their posts
        for (uint256 i = 0; i < allUsers.length; i++) {
            address user = allUsers[i];
            allPosts = _concatArrays(allPosts, posts[user]);
        }

        return allPosts;
    }

    // Helper function to concatenate two arrays
    function _concatArrays(Post[] memory array1, Post[] memory array2) internal pure returns (Post[] memory) {
        Post[] memory result = new Post[](array1.length + array2.length);
        uint256 i;
        for (i = 0; i < array1.length; i++) {
            result[i] = array1[i];
        }
        for (uint256 j = 0; j < array2.length; j++) {
            result[i + j] = array2[j];
        }
        return result;
    }
}