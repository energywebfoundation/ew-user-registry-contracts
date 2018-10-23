// Copyright 2018 Energy Web Foundation
// This file is part of the Origin Application brought to you by the Energy Web Foundation,
// a global non-profit organization focused on accelerating blockchain technology across the energy sector, 
// incorporated in Zug, Switzerland.
//
// The Origin Application is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// This is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY and without an implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details, at <http://www.gnu.org/licenses/>.
//
// @authors: slock.it GmbH, Martin Kuechler, martin.kuechler@slock.it

pragma solidity ^0.4.24;

import "ew-utils-general-contracts/Msc/Owned.sol";
import "ew-utils-general-contracts/Interfaces/Updatable.sol";
import "../contracts/Interfaces/UserContractLookupInterface.sol";

/// @title Contract for storing the current logic-contracts-addresses for the certificate of origin
contract UserContractLookup is Owned, UserContractLookupInterface {

    Updatable public userRegistry;

    /// @notice The constructor 
    constructor() Owned(msg.sender) public{ } 

    /// @notice function to initialize the contracts, setting the needed contract-addresses
    /// @param _userRegistry user-registry logic contract address
    /// @param _db the database-contract of the user-registry-system
    function init(Updatable _userRegistry, address _db) 
        external
        onlyOwner
    {
        require(_userRegistry != address(0) && userRegistry == address(0), "already initialized");
        require(_db != 0, "_db cannot be 0");
        userRegistry = _userRegistry;
        userRegistry.init(_db, msg.sender);
    }

    /// @notice function to update one or more logic-contracts
    /// @param _userRegistry address of the new user-registry-logic-contract
    function update(
        Updatable _userRegistry
    )
        external
        onlyOwner 
    {
        require(address(_userRegistry)!= 0, "update: cannot set to 0");
        userRegistry.update(_userRegistry);
        userRegistry = _userRegistry;
    }

    /// @notice returns the current userRegistryLogic that has access to the db
    /// @dev this function will be called by external contracts
    /// @return the user-Registry 
    function userRegistry() external view returns (address){
        return userRegistry;
    }
}