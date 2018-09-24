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
describe('UserContractLookup', () => {
    const configFile = JSON.parse(fs.readFileSync(process.cwd() + '/connection-config.json', 'utf8'));
    const Web3 = require('web3');
    const web3 = new Web3(configFile.develop.web3);
    let userContractLookup;
    let userRegistry;
    let userDB;
    const privateKeyDeployment = configFile.develop.deployKey.startsWith('0x') ?
        configFile.develop.deployKey : '0x' + configFile.develop.deployKey;
    const accountDeployment = web3.eth.accounts.privateKeyToAccount(privateKeyDeployment).address;
    it('should deploy the contracts', () => __awaiter(this, void 0, void 0, function* () {
        const contracts = yield migrateContracts_1.migrateUserRegistryContracts(web3);
        userContractLookup = new UserContractLookup_1.UserContractLookup(web3, contracts['solidity_modules/ew-user-registry-contracts/dist/UserContractLookup.json']);
        userRegistry = new UserLogic_1.UserLogic(web3, contracts['solidity_modules/ew-user-registry-contracts/dist/UserLogic.json']);
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
        chai_1.assert.equal(yield userContractLookup.owner(), accountDeployment);
    }));
    it('should have the right userRegistry', () => __awaiter(this, void 0, void 0, function* () {
        chai_1.assert.equal(yield userContractLookup.userRegistry(), userRegistry.web3Contract._address);
    }));
    it('should throw an error when calling init again', () => __awaiter(this, void 0, void 0, function* () {
        let failed = false;
        try {
            yield userContractLookup.init(userRegistry.web3Contract._address, userRegistry.web3Contract._address, { privateKey: privateKeyDeployment });
        }
        catch (ex) {
            failed = true;
        }
        chai_1.assert.isTrue(failed);
    }));
    it('should throw an error when calling update as non Owner', () => __awaiter(this, void 0, void 0, function* () {
        let failed = false;
        try {
            yield userContractLookup.update('0x1000000000000000000000000000000000000005', { privateKey: '0x191c4b074672d9eda0ce576cfac79e44e320ffef5e3aadd55e000de57341d36c' });
        }
        catch (ex) {
            failed = true;
        }
        chai_1.assert.isTrue(failed);
    }));
    it('should be able to update as owner', () => __awaiter(this, void 0, void 0, function* () {
        yield userContractLookup.update('0x1000000000000000000000000000000000000005', { privateKey: privateKeyDeployment });
        chai_1.assert.equal(yield userContractLookup.userRegistry(), '0x1000000000000000000000000000000000000005');
        chai_1.assert.equal(yield userDB.owner(), '0x1000000000000000000000000000000000000005');
    }));
    it('should throw when trying to change owner as non-owner', () => __awaiter(this, void 0, void 0, function* () {
        let failed = false;
        try {
            yield userContractLookup.changeOwner('0x1000000000000000000000000000000000000005', { privateKey: '0x191c4b074672d9eda0ce576cfac79e44e320ffef5e3aadd55e000de57341d36c' });
        }
        catch (ex) {
            failed = true;
        }
        chai_1.assert.isTrue(failed);
    }));
    it('should be able to change owner ', () => __awaiter(this, void 0, void 0, function* () {
        yield userContractLookup.changeOwner('0x1000000000000000000000000000000000000005', { privateKey: privateKeyDeployment });
        chai_1.assert.equal(yield userContractLookup.owner(), '0x1000000000000000000000000000000000000005');
    }));
});
//# sourceMappingURL=UserContractLookup.js.map