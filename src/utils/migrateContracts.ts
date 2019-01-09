import { UserContractLookup } from '../wrappedContracts/UserContractLookup';
import Web3 = require('web3');
import UserDBJSON from '../../contract-build/UserDB.json';
import UserLogicJSON from '../../contract-build/UserLogic.json';
import { UserContractLookupJSON } from '..';

import { deploy } from 'ew-deployment';

export async function migrateUserRegistryContracts(web3: Web3, deployKey: string): Promise<JSON> {
    return new Promise<any>(async (resolve, reject) => {

        // const configFile = JSON.parse(fs.readFileSync('connection-config.json', 'utf8'));

        const privateKeyDeployment = deployKey.startsWith('0x') ?
            deployKey : '0x' + deployKey;

        const userContractLookupAddress = (await deploy(
            web3,
            UserContractLookupJSON.bytecode,
            { privateKey: privateKeyDeployment })).contractAddress;

        const userLogicAddress = (await deploy(
            web3,
            UserLogicJSON.bytecode + web3.eth.abi.encodeParameter('address', userContractLookupAddress).substr(2),
            { privateKey: privateKeyDeployment })).contractAddress;

        const userDBAddress = (await deploy(
            web3,
            UserDBJSON.bytecode + web3.eth.abi.encodeParameter('address', userLogicAddress).substr(2),
            { privateKey: privateKeyDeployment })).contractAddress;

        const userContractLookup = new UserContractLookup((web3 as any), userContractLookupAddress);
        await userContractLookup.init(
            userLogicAddress, userDBAddress,
            { privateKey: privateKeyDeployment },
        );

        const resultMapping = {} as any;

        resultMapping.UserContractLookup = userContractLookupAddress;
        resultMapping.UserLogic = userLogicAddress;
        resultMapping.UserDB = userDBAddress;

        resolve(resultMapping);
    });
}
