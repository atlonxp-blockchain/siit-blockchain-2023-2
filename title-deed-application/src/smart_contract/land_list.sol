// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract land_list{

    uint256 sheet_count = 0;
    uint256[] sheet_number_list;
    address[] contract_address_list;

    mapping (uint256 => bool) number_in_use;
    mapping (address => bool) contract_in_use;
    mapping (uint256 => address) num_to_contract;
    mapping (address => uint256) contract_to_num;
    mapping (address => bool) authorized_list;

    struct log_data{
        uint256 timestamp;
        address invoker;
        string description;
    }

    log_data[] log_list;

    constructor(
        address[] memory _authorized_list
    ){
        for(uint256 i = 0; i < _authorized_list.length; i++){
            authorized_list[_authorized_list[i]] = true;
        }

        authorized_list[msg.sender] = true;
        log_list.push(log_data(block.timestamp,msg.sender,"Created contract"));

    }

    function get_sheet_list() public view returns(uint256[] memory){
        return sheet_number_list;
    }

    function get_contract_list() public view returns(address[] memory){
        return contract_address_list;
    }

    function get_contract_by_num(uint256 sheet_number) public view returns(address){
        return num_to_contract[sheet_number];
    }

    function get_num_by_contract(address contract_adress) public view returns(uint256){
        return contract_to_num[contract_adress];
    }

    function add_sheet_list(uint256 sheet_number, address contract_address) public {
        require(authorized_list[msg.sender] == true,"You don't have permission");
        require(number_in_use[sheet_number] == false, "Sheet number is in used");
        require(contract_in_use[contract_address] == false, "Contract address is in used");
        
        sheet_number_list.push(sheet_number);
        contract_address_list.push(contract_address);
        num_to_contract[sheet_number] = contract_address;
        contract_to_num[contract_address] = sheet_number;

        number_in_use[sheet_number] = true;
        contract_in_use[contract_address] = true;
        sheet_count+=1;

        log_list.push(log_data(block.timestamp,msg.sender,"Add new sheet"));

    }

    function revoke(address user_address) public {
        require(authorized_list[msg.sender] == true,"You don't have permission");
        require(authorized_list[user_address] == true,"The provided user already lack of permission");
        require(msg.sender != user_address,"You cannot revoke yourself");
        authorized_list[user_address] = false;
        log_list.push(log_data(block.timestamp,msg.sender,string(abi.encodePacked("revoked ", addressToString(user_address)," successfully"))));
    }

    function authorize(address user_address) public{
        require(authorized_list[msg.sender] = true,"You don't have permission");
        require(authorized_list[user_address] == false, "The provided user is already authorized");
        authorized_list[user_address] = true;
        log_list.push(log_data(block.timestamp,msg.sender,string(abi.encodePacked("auhtorized ", addressToString(user_address)," successfully"))));
    }

    function check_authorize(address user_address) public view returns(bool){
        return authorized_list[user_address];
    }

    function addressToString(address addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(addr)));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";

        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }

        return string(str);
    }

    function get_last_sheet_number() public view returns(uint256){
        return sheet_count;
    }

    function get_log() public view returns(log_data[] memory){
        return log_list;
    }
}