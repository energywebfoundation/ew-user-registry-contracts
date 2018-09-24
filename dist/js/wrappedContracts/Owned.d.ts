import { Tx, Logs, Web3Type } from 'sloffle';
import { GeneralFunctions } from './GeneralFunctions';
export declare class Owned extends GeneralFunctions {
    web3: Web3Type;
    buildFile: any;
    constructor(web3: Web3Type, address?: string);
    getAllLogChangeOwnerEvents(eventFilter?: Logs): Promise<any>;
    getAllEvents(eventFilter?: Logs): Promise<any>;
    owner(txParams?: Tx): Promise<any>;
    changeOwner(_newOwner: string, txParams?: Tx): Promise<any>;
}
