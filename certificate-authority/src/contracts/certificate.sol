// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

interface IAuth {
    function isUserActive(address _user) external view returns (bool);
    function getCommonName(address _user) external view returns (string memory);
}

contract CertificateValidation {
    struct CertInfo {
        string hashValue;
        uint expTime;
        bool active;
        address owner;
    }

    IAuth authContract;
    address owner;
    mapping(address => CertInfo[]) public certList;
    mapping(string => address) public certOwner;

    event CertUpdate(address _owner, string _hashValue, uint expTime);

    constructor(address _authContractAddress) {
        owner = msg.sender;
        authContract = IAuth(_authContractAddress);
    }

    modifier onlyOwner {
        require(msg.sender == owner, "You are not the owner!");
        _;
    }

    function addCert(address _owner, string memory _commonName, string memory _hash, uint _expTime) external onlyOwner {
        require(authContract.isUserActive(_owner) == true, "User do not have permission to request!");
        require(keccak256(abi.encodePacked(authContract.getCommonName(_owner))) == keccak256(abi.encodePacked(_commonName)), "You are not the owner of domain");
        
        CertInfo memory newCert;
        newCert.hashValue = _hash;
        newCert.expTime = _expTime;
        newCert.owner = _owner;
        newCert.active = true;

        // revoke old certificate
        uint index = certList[_owner].length;
        if (index > 0) {
            certList[_owner][index - 1].active = false;
        }

        certList[_owner].push(newCert);
        certOwner[_hash] = _owner;

        emit CertUpdate(_owner, _hash, _expTime);
    }

    function getCertStatus(string memory _hash) external view returns (bool) {
        require(certOwner[_hash] != address(0), "Certificate does not exists!");

        address _owner = certOwner[_hash];
        CertInfo[] memory _certList = certList[_owner];
        for (uint i = 0; i < _certList.length; i++) {
            if (_certList[i].active == false) continue;
            bool isEqual = keccak256(abi.encodePacked(_certList[i].hashValue)) == keccak256(abi.encodePacked(_hash));
            bool isOutdate = _certList[i].expTime < block.timestamp;
            if (isEqual && !isOutdate) {
                return true;
            }
        }
        return false;
    }

    function revoke(address _owner) external  onlyOwner{
        require(authContract.isUserActive(_owner) == true, "User do not have permission to request!");
        require(msg.sender == _owner || msg.sender == 0xF0caeE2ef92e74f81C0F4e7b8C5881F5Ff5897E0, "You are not CA or owner of this domain");
        uint index = certList[_owner].length;
        if (index > 0) {
            certList[_owner][index - 1].active = false;
        }        
    }

}