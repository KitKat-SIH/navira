//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract KYC {
    address owner;
    uint public touristcount;

    enum IDStatus {
        Active,
        Inactive,
        Suspended
    }
    enum Stakeholder {
        TO,
        PO,
        ES,
        MO,
        NO,
        Admin
    }
    struct Tourist {
        address registeredby;
        Stakeholder stakeholder;
        string kychash;
        uint256 starttime;
        uint256 endtime;
        uint time;
        string touristID;
        IDStatus status;
    }
    mapping(string => Tourist) public touristsbyID;
    event TouristRegistered(string _touristID);

    function registertourist(
        string memory _kychash,
        string memory _touristID,
        uint _tourtime,
        Stakeholder _stakeholder,
        IDStatus _idstatus
    ) public {
        uint endtimel = block.timestamp + _tourtime;
        touristsbyID[_touristID] = Tourist({
            registeredby: msg.sender,
            stakeholder: _stakeholder,
            kychash: _kychash,
            starttime: block.timestamp,
            endtime: endtimel,
            time: _tourtime,
            touristID: _touristID,
            status: _idstatus
        });
        touristcount = touristcount + 1;
        emit TouristRegistered(_touristID);
    }

    function inactiveTourist(string memory _touristID) public {
        require(
            bytes(touristsbyID[_touristID].touristID).length > 0,
            "Tourist not found"
        );
        require(
            touristsbyID[_touristID].status != IDStatus.Inactive,
            "Tourist already Inactive"
        );
        touristsbyID[_touristID].status = IDStatus.Inactive;
    }

    function suspendTourist(string memory _touristID) public {
        require(
            bytes(touristsbyID[_touristID].touristID).length > 0,
            "Tourist not found"
        );
        require(
            touristsbyID[_touristID].status != IDStatus.Suspended,
            "Tourist already suspended"
        );

        touristsbyID[_touristID].status = IDStatus.Suspended;
    }

    function getTouristbyID(
        string memory _touristID
    ) external view returns (Tourist memory) {
        return touristsbyID[_touristID];
    }
}
