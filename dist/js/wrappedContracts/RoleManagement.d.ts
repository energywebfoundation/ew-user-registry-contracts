import { Tx, Logs, Web3Type } from 'sloffle';
import { GeneralFunctions } from './GeneralFunctions';
export declare class RoleManagement extends GeneralFunctions {
    web3: Web3Type;
    buildFile: any;
    constructor(web3: Web3Type, address?: string);
    getAllLogChangeOwnerEvents(eventFilter?: Logs): Promise<any>;
    getAllEvents(eventFilter?: Logs): Promise<any>;
    userContractLookup(txParams?: Tx): Promise<any>;
    owner(txParams?: Tx): Promise<any>;
    changeOwner(_newOwner: string, txParams?: Tx): Promise<any>;
    isRole(_role: number, _caller: string, txParams?: Tx): Promise<any>;
}
