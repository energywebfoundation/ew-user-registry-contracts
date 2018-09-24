"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fs = require("fs");
require("mocha");
const migrateContracts_1 = require("../utils/migrateContracts");
const UserContractLookup_1 = require("../wrappedContracts/UserContractLookup");
const UserLogic_1 = require("../wrappedContracts/UserLogic");
const UserDB_1 = require("../wrappedContracts/UserDB");
describe('UserLogic', () => {
    const configFile = JSON.parse(fs.readFileSync(process.cwd() + '/connection-config.json', 'utf8'));
    const Web3 = require('web3');
    const web3 = new Web3(configFile.develop.web3);
    let userContractLookup;
    let userLogic;
    let userDB;
    const privateKeyDeployment = configFile.develop.deployKey.startsWith('0x') ?
        configFile.develop.deployKey : '0x' + configFile.develop.deployKey;
    const accountDeployment = web3.eth.accounts.privateKeyToAccount(privateKeyDeployment).address;
    it('should deploy the contracts', () => __awaiter(this, void 0, void 0, function* () {
        const contracts = yield migrateContracts_1.migrateUserRegistryContracts(web3);
        userContractLookup = new UserContractLookup_1.UserContractLookup(web3, contracts['solidity_modules/ew-user-registry-contracts/dist/UserContractLookup.json']);
        userLogic = new UserLogic_1.UserLogic(web3, contracts['solidity_modules/ew-user-registry-contracts/dist/UserLogic.json']);
        userDB = new UserDB_1.UserDB(web3, contracts['solidity_modules/ew-user-registry-contracts/dist/UserDB.json']);
        let numberContracts = 0;
        Object.keys(contracts).forEach((key) => __awaiter(this, void 0, void 0, function* () {
            numberContracts += 1;
            const deployedBytecode = yield web3.eth.getCode(contracts[key]);
            chai_1.assert.isTrue(deployedBytecode.length > 0);
            const contractInfo = JSON.parse(fs.readFileSync(key, 'utf8'));
            const tempBytecode = '0x' + contractInfo.deployedBytecode;
            chai_1.assert.equal(deployedBytecode, tempBytecode);
        }));
        chai_1.assert.equal(numberContracts, 3);
    }));
    it('should have the right owner', () => __awaiter(this, void 0, void 0, function* () {
        chai_1.assert.equal(yield userLogic.owner(), userContractLookup.web3Contract._address);
    }));
    it('should have the right db', () => __awaiter(this, void 0, void 0, function* () {
        chai_1.assert.equal(yield userLogic.db(), userDB.web3Contract._address);
    }));
    it('should throw an error when calling init again', () => __awaiter(this, void 0, void 0, function* () {
        let failed = false;
        try {
            yield userLogic.init(userLogic.web3Contract._address, userLogic.web3Contract._address, { privateKey: privateKeyDeployment });
        }
        catch (ex) {
            failed = true;
        }
        chai_1.assert.isTrue(failed);
    }));
    it('should gave the topAdmin rights to the deployer account', () => __awaiter(this, void 0, void 0, function* () {
        chai_1.assert.equal(yield userLogic.getRolesRights(accountDeployment), 1);
    }));
    it('should return 0 rights for random accounts', () => __awaiter(this, void 0, void 0, function* () {
        chai_1.assert.equal(yield userLogic.getRolesRights('0x1000000000000000000000000000000000000005'), 0);
    }));
    it('should return false when asking for a non-exising user', () => __awaiter(this, void 0, void 0, function* () {
        chai_1.assert.isFalse(yield userLogic.doesUserExist('0x1000000000000000000000000000000000000005'));
    }));
    it('should return empty values for a non existing user', () => __awaiter(this, void 0, void 0, function* () {
        chai_1.assert.deepEqual(yield userLogic.getFullUser('0x1000000000000000000000000000000000000005'), {
            0: '',
            1: '0',
            2: false,
            _organization: '',
            _roles: '0',
            _active: false,
        });
    }));
    it('should fail when trying to set roles for a non-existing user', () => __awaiter(this, void 0, void 0, function* () {
        let failed = false;
        try {
            yield userLogic.setRoles('0x1000000000000000000000000000000000000005', 1, { privateKey: privateKeyDeployment });
        }
        catch (ex) {
            failed = true;
        }
        chai_1.assert.isTrue(failed);
    }));
    it('should return correct values for an existing user', () => __awaiter(this, void 0, void 0, function* () {
        yield userLogic.setUser('0x1000000000000000000000000000000000000005', 'TestOrganization', { privateKey: privateKeyDeployment });
        chai_1.assert.deepEqual(yield userLogic.getFullUser('0x1000000000000000000000000000000000000005'), {
            0: 'TestOrganization',
            1: '0',
            2: true,
            _organization: 'TestOrganization',
            _roles: '0',
            _active: true,
        });
    }));
    it('should fail trying to set roles as non user-Admin', () => __awaiter(this, void 0, void 0, function* () {
        let failed = false;
        try {
            yield userLogic.setRoles('0x1000000000000000000000000000000000000005', 1, { privateKey: '0x191c4b074672d9eda0ce576cfac79e44e320ffef5e3aadd55e000de57341d36c' });
        }
        catch (ex) {
            failed = true;
        }
        chai_1.assert.isTrue(failed);
    }));
    it('should fail trying to set roles as non user-Admin', () => __awaiter(this, void 0, void 0, function* () {
        yield userLogic.setRoles('0x1000000000000000000000000000000000000005', 1, { privateKey: privateKeyDeployment });
        chai_1.assert.equal(yield userLogic.getRolesRights('0x1000000000000000000000000000000000000005'), 1);
        chai_1.assert.deepEqual(yield userLogic.getFullUser('0x1000000000000000000000000000000000000005'), {
            0: 'TestOrganization',
            1: '1',
            2: true,
            _organization: 'TestOrganization',
            _roles: '1',
            _active: true,
        });
    }));
    it('should return true when asking for an exising user', () => __awaiter(this, void 0, void 0, function* () {
        chai_1.assert.isTrue(yield userLogic.doesUserExist('0x1000000000000000000000000000000000000005'));
    }));
    it('should fail when trying to deactive an active admin-account', () => __awaiter(this, void 0, void 0, function* () {
        let failed = false;
        try {
            yield userLogic.deactivateUser('0x1000000000000000000000000000000000000005', { privateKey: privateKeyDeployment });
        }
        catch (ex) {
            failed = true;
        }
        chai_1.assert.isTrue(failed);
    }));
    it('should deactive user when he is not an admin anymore', () => __awaiter(this, void 0, void 0, function* () {
        yield userLogic.setRoles('0x1000000000000000000000000000000000000005', 48, { privateKey: privateKeyDeployment });
        yield userLogic.deactivateUser('0x1000000000000000000000000000000000000005', { privateKey: privateKeyDeployment });
        chai_1.assert.isFalse(yield userLogic.doesUserExist('0x1000000000000000000000000000000000000005'));
    }));
});
//# sourceMappingURL=UserLogic.js.map