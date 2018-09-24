import { Tx, Logs, Web3Type } from 'sloffle';
import { GeneralFunctions } from './GeneralFunctions';
export declare class UserLogic extends GeneralFunctions {
    web3: Web3Type;
    buildFile: any;
    constructor(web3: Web3Type, address?: string);
    getAllLogChangeOwnerEvents(eventFilter?: Logs): Promise<any>;
    getAllEvents(eventFilter?: Logs): Promise<any>;
    deactivateUser(_user: string, txParams?: Tx): Promise<any>;
    update(_newLogic: string, txParams?: Tx): Promise<any>;
    getRolesRights(_user: string, txParams?: Tx): Promise<any>;
    setRoles(_user: string, _rights: number, txParams?: Tx): Promise<any>;
    setUser(_user: string, _organization: string, txParams?: Tx): Promise<any>;
    userContractLookup(txParams?: Tx): Promise<any>;
    db(txParams?: Tx): Promise<any>;
    owner(txParams?: Tx): Promise<any>;
    changeOwner(_newOwner: string, txParams?: Tx): Promise<any>;
    isRole(_role: number, _caller: string, txParams?: Tx): Promise<any>;
    getFullUser(_user: string, txParams?: Tx): Promise<any>;
    doesUserExist(_user: string, txParams?: Tx): Promise<any>;
    init(_database: string, _admin: string, txParams?: Tx): Promise<any>;
}
