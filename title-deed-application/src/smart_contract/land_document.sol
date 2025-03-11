// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract land_document{

    uint256 sheet_number;
    uint256 create_time;
    
    address assigner_address;
    bool active;

    struct holder{
        uint256 national_ID;
        uint256 time_hold;
        uint256 parcel_number;
        string holder_name;
    }

    struct region{
        uint256 parcel_number;
        string land_size;
        uint256 assign_time;
        string coordinates;
        string land_address;
    }

    struct log_data{
        uint256 timestamp;
        address invoker;
        string description;
    }

    holder[] holder_list;
    log_data[] log_list;
    region[] region_list;

    mapping(address => bool) authorized_address;

    constructor(
        uint256 _sheet_number,
        uint256 _national_ID,
        string memory _land_size,
        string memory _holder_name,
        string memory _coordinates,
        string memory _land_address,
        address[] memory authorized_list
    ) {
        sheet_number = _sheet_number;
        create_time = block.timestamp;
        assigner_address = msg.sender;
        active = true;

        holder_list.push(holder(_national_ID,block.timestamp,1,_holder_name));
        region_list.push(region(1,_land_size,block.timestamp,_coordinates,_land_address));

        authorized_address[msg.sender] = true;
        for(uint256 i = 0; i < authorized_list.length; i++){
            authorized_address[authorized_list[i]] = true;
        }

        log_list.push(log_data(block.timestamp,msg.sender,"Created contract"));
    }

    function cancel_document() public{
        require(authorized_address[msg.sender] == true,"You don't have permission");
        require(active == true, "The document is already deactivated");
        active = false;
        log_list.push(log_data(block.timestamp,msg.sender,"Cancled document"));
    }

    function reactivate() public{
        require(authorized_address[msg.sender] == true,"You don't have permission");
        require(active == false, "The document is already in used");
        active = true;
        log_list.push(log_data(block.timestamp,msg.sender,"Reactivated document"));
    }

    function change_region(
        string memory _land_size,
        string memory _coordinates,
        string memory _land_address
    ) public {
        require(authorized_address[msg.sender] = true,"You don't have permission");
        require(active == true, "This document is canceled");
        region_list.push(region(region_list.length+1,_land_size,block.timestamp,_coordinates,_land_address));
        holder_list[holder_list.length - 1].parcel_number = region_list.length;
        log_list.push(log_data(block.timestamp,msg.sender,"Changed parcel"));
    }

    function transfer(
        uint256 _national_ID,
        string memory _holder_name
    ) public{
        require(authorized_address[msg.sender] = true,"You don't have permission");
        require(active = true,"This document is canceled");
        require(_national_ID != holder_list[holder_list.length-1].national_ID,"The transfee is same as transferer");
        require(bytes(holder_list[holder_list.length-1].holder_name).length != bytes(_holder_name).length,"The transferee is same as transferer");
        require(keccak256(abi.encodePacked(holder_list[holder_list.length-1].holder_name)) != keccak256(abi.encodePacked(_holder_name)),"The transferee is same as transferer");
        holder_list.push(holder(_national_ID,block.timestamp,region_list[region_list.length-1].parcel_number,_holder_name));
        log_list.push(log_data(block.timestamp,msg.sender,string(abi.encodePacked("Trasnfered ownership to ",_holder_name))));
    }
    
    function get_log() public view returns(log_data[] memory){
        return log_list;
    }

    function get_hold_history() public view returns(holder[] memory){
        return holder_list;
    }

    function get_parcel_history() public view returns(region[] memory){
        return region_list;
    }

    function get_metadata() public view returns(uint256,uint256,address,bool){
        return(sheet_number,create_time,assigner_address,active);

    }

    function get_last_record() public view returns(
        uint256,
        uint256,
        uint256,
        string memory,
        string memory,
        uint256,
        string memory,
        string memory
    ){
        holder memory holder_temp = holder_list[holder_list.length-1];
        region memory region_temp = region_list[region_list.length-1];

        return(
            holder_temp.national_ID,
            holder_temp.time_hold,
            holder_temp.parcel_number,
            holder_temp.holder_name,
            region_temp.land_size,
            region_temp.assign_time,
            region_temp.coordinates,
            region_temp.land_address
        );
    }

    function revoke(address user_address) public {
        require(authorized_address[msg.sender] == true,"You don't have permission");
        require(authorized_address[user_address] == true,"The provided user already lack of permission");
        authorized_address[user_address] = false;
        log_list.push(log_data(block.timestamp,msg.sender,string(abi.encodePacked("revoked ", addressToString(user_address)," successfully"))));
    }

    function authorize(address user_address) public{
        require(authorized_address[msg.sender] = true,"You don't have permission");
        require(authorized_address[user_address] == false, "The provided user is already authorized");
        authorized_address[user_address] = true;
        log_list.push(log_data(block.timestamp,msg.sender,string(abi.encodePacked("auhtorized ", addressToString(user_address)," successfully"))));
    }

    function check_authorize(address user_address) public view returns(bool){
        return authorized_address[user_address];
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

}