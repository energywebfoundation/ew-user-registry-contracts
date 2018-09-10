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
// @authors: slock.it GmbH, Martin Kuechler, martin.kuchler@slock.it
pragma solidity ^0.4.23;
pragma experimental ABIEncoderV2;

import "../Msc/Owned.sol";

/// @title The database contract for the users, traders and admins of the certificate of origin
/// @notice This contract only provides getter and setter methods that are only callable by the corresponging owner-contract
contract UserDB is Owned {
    
    /// @notice The structure of an user / admin / trader
    /// @dev as it's for now impossible to return a struct, there is a special get-function for this struct. 
    /// @dev keep in mind to update that function aswell when changing the user-struct
    struct User {
        string organization;
        uint roles;
        bool active;
    }

    /// @notice mapping for addresses to users
    mapping(address => User) private userList;  

    modifier userExists(address _user) {
        require(userList[_user].active);
        _;
    }

    /// @notice The constructor of the UserDB
    /// @dev the deployer of this contract will get full adminrights!
    constructor(address _logic) Owned(_logic) public { }

    /// @notice function to change the name of an existing organization, can only be used when the user already exists
    /// @dev the onlyOwner-modifier is used, so that only the logic-contract is allowed to write into the storage
    /// @param _user ethereum-address of an user
    /// @param _organization new name of the organization
    function setOrganization(address _user, string _organization) external onlyOwner userExists(_user){
        User storage u = userList[_user];
        u.organization = _organization;
    }

    /// @notice function for creating, editing an user, it cannot be used to set a Role of an user
    /// @notice if the user does not exists yet it will be creates, otherwise the older userdata will be overwritten
    /// @dev the onlyOwner-modifier is used, so that only the logic-contract is allowed to write into the storage
    /// @param _user address of the user
    /// @param _organization organization the user is representing
    function setUser(
        address _user, 
        string _organization
    ) 
        external 
        onlyOwner 
    {
        User storage u = userList[_user];
        u.organization = _organization;
        u.active = true;
    }
 
    /// @notice function to (de-)active a user, dan only be used when the user already exists
    /// @dev the onlyOwner-modifier is used, so that only the logic-contract is allowed to write into the storage
    /// @param _user ethereum-address of an user
    /// @param _active flag if the account should be active
    function setUserActive(address _user, bool _active) external onlyOwner {
        User storage u = userList[_user];
        u.active = _active;
    }

    /// @notice function for editing the rights of an user
    /// @dev the onlyOwner-modifier is used, so that only the logic-contract is allowed to write into the storage
    /// @param _user address of the user
    /// @param _roles first name of the user
    function setRoles(address _user, uint _roles) external onlyOwner {
        User storage u = userList[_user];
        u.roles = _roles;
    } 

    /// @notice function to return all the data of an user
    /// @dev the onlyOwner-modifier is used, so that only the logic-contract is allowed to read directly from the contract
    /// @param _user user 
    /// @return returns firstName, surname, organization, street, number, zip, city, country, state, roles and the active-flag
    function getFullUser(address _user)
        onlyOwner
        external
        view 
        returns (
          User
        )
    {
        return userList[_user];
    }  
}