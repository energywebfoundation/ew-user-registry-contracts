import * as path from 'path';
import { UserContractLookup } from '../wrappedContracts/UserContractLookup';
import { Web3Type } from '../types/web3';
import { UserContractLookupJSON, UserLogicJSON, UserDBJSON } from '..';
import { deploy } from 'ew-deployment';

export async function migrateUserRegistryContracts(web3: Web3Type, deployKey: string): Promise<JSON> {
    return new Promise<any>(async (resolve, reject) => {

        // const configFile = JSON.parse(fs.readFileSync('connection-config.json', 'utf8'));

        const privateKeyDeployment = deployKey.startsWith('0x') ?
            deployKey : '0x' + deployKey;

        const userContractLookupAddress = (await deploy(
            web3,
            (UserContractLookupJSON as any).bytecode,
            { privateKey: privateKeyDeployment })).contractAddress;

        const userLogicAddress = (await deploy(
            web3,
            (UserLogicJSON as any).bytecode + web3.eth.abi.encodeParameter('address', userContractLookupAddress).substr(2),
            { privateKey: privateKeyDeployment })).contractAddress;

        const userDBAddress = (await deploy(
            web3,
            (UserDBJSON as any).bytecode + web3.eth.abi.encodeParameter('address', userLogicAddress).substr(2),
            { privateKey: privateKeyDeployment })).contractAddress;

        const userContractLookup = new UserContractLookup((web3 as any), userContractLookupAddress);
        await userContractLookup.init(
            userLogicAddress, userDBAddress,
            { privateKey: privateKeyDeployment },
        );

        const resultMapping = {};

        resultMapping[path.resolve(__dirname, '../../contracts/UserContractLookup.json')] = userContractLookupAddress;
        resultMapping[path.resolve(__dirname, '../../contracts/UserLogic.json')] = userLogicAddress;
        resultMapping[path.resolve(__dirname, '../../contracts/UserDB.json')] = userDBAddress;

        /*
        const userContractLookupWeb3 = await deploy(
            path.resolve(__dirname, '../../contracts/UserContractLookup.json'),
            [],
            { privateKey: privateKeyDeployment },
        );
     
        const userLogicWeb3 = await deploy(
            path.resolve(__dirname, '../../contracts/UserLogic.json'),
            [userContractLookupWeb3._address],
            { privateKey: privateKeyDeployment },
        );
     
        const userDbWeb3 = await deploy(
            path.resolve(__dirname, '../../contracts/UserDB.json'),
            [userLogicWeb3._address],
            { privateKey: privateKeyDeployment },
        );
     
        const userContractLookup = new UserContractLookup((web3 as any), userContractLookupWeb3._address);
        await userContractLookup.init(
            userLogicWeb3._address, userDbWeb3._address,
            { privateKey: privateKeyDeployment },
        );
    */
        resolve(resultMapping);
    });
}
