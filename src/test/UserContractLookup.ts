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

import { assert } from 'chai';
import * as fs from 'fs';
import 'mocha';
import { Web3Type } from '../types/web3';
import { migrateUserRegistryContracts } from '../utils/migrateContracts';
import { UserContractLookup } from '../wrappedContracts/UserContractLookup';
import { UserLogic } from '../wrappedContracts/UserLogic';
import { UserDB } from '../wrappedContracts/UserDB';

describe('UserContractLookup', () => {

    const configFile = JSON.parse(fs.readFileSync(process.cwd() + '/connection-config.json', 'utf8'));

    const Web3 = require('web3');
    const web3: Web3Type = new Web3(configFile.develop.web3);

    let userContractLookup: UserContractLookup;
    let userRegistry: UserLogic;
    let userDB: UserDB;

    const privateKeyDeployment = configFile.develop.deployKey.startsWith('0x') ?
        configFile.develop.deployKey : '0x' + configFile.develop.deployKey;

    const accountDeployment = web3.eth.accounts.privateKeyToAccount(privateKeyDeployment).address;

    it('should deploy the contracts', async () => {

        const contracts = await migrateUserRegistryContracts(web3);

        userContractLookup = new UserContractLookup((web3 as any));
        userRegistry = new UserLogic((web3 as any));
        userDB = new UserDB((web3 as any));

        let numberContracts = 0;

        Object.keys(contracts).forEach(async (key) => {
            numberContracts += 1;

            const deployedBytecode = await web3.eth.getCode(contracts[key]);
            assert.isTrue(deployedBytecode.length > 0);

            const contractInfo = JSON.parse(fs.readFileSync(key, 'utf8'));

            const tempBytecode = '0x' + contractInfo.deployedBytecode;
            assert.equal(deployedBytecode, tempBytecode);

        });

        assert.equal(numberContracts, 3);

    });

    it('should have the right owner', async () => {

        assert.equal(await userContractLookup.owner(), accountDeployment);

    });

    it('should have the right userRegistry', async () => {

        assert.equal(await userContractLookup.userRegistry(), userRegistry.web3Contract._address);

    });

    it('should throw an error when calling init again', async () => {

        let failed = false;

        try {
            await userContractLookup.init(userRegistry.web3Contract._address, userRegistry.web3Contract._address, { privateKey: privateKeyDeployment });
        }
        catch (ex) {
            failed = true;
        }

        assert.isTrue(failed);
    });

    it('should throw an error when calling update as non Owner', async () => {

        let failed = false;

        try {
            await userContractLookup.update('0x1000000000000000000000000000000000000005', { privateKey: '0x191c4b074672d9eda0ce576cfac79e44e320ffef5e3aadd55e000de57341d36c' });
        }
        catch (ex) {
            failed = true;
        }

        assert.isTrue(failed);
    });

    it('should be able to update as owner', async () => {

        await userContractLookup.update('0x1000000000000000000000000000000000000005', { privateKey: privateKeyDeployment });

        assert.equal(await userContractLookup.userRegistry(), '0x1000000000000000000000000000000000000005');
        assert.equal(await userDB.owner(), '0x1000000000000000000000000000000000000005');
    });

    it('should throw when trying to change owner as non-owner', async () => {

        let failed = false;

        try {
            await userContractLookup.changeOwner('0x1000000000000000000000000000000000000005', { privateKey: '0x191c4b074672d9eda0ce576cfac79e44e320ffef5e3aadd55e000de57341d36c' });
        }
        catch (ex) {
            failed = true;
        }

        assert.isTrue(failed);

    });

    it('should be able to change owner ', async () => {

        await userContractLookup.changeOwner('0x1000000000000000000000000000000000000005', { privateKey: privateKeyDeployment });

        assert.equal(await userContractLookup.owner(), '0x1000000000000000000000000000000000000005');

    });

});
