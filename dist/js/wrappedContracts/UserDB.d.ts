import { Tx, Logs, Web3Type } from 'sloffle';
import { GeneralFunctions } from './GeneralFunctions';
export declare class UserDB extends GeneralFunctions {
    web3: Web3Type;
    buildFile: any;
    constructor(web3: Web3Type, address?: string);
    getAllLogChangeOwnerEvents(eventFilter?: Logs): Promise<any>;
    getAllEvents(eventFilter?: Logs): Promise<any>;
    setOrganization(_user: string, _organization: string, txParams?: Tx): Promise<any>;
    setRoles(_user: string, _roles: number, txParams?: Tx): Promise<any>;
    setUser(_user: string, _organization: string, txParams?: Tx): Promise<any>;
    setUserActive(_user: string, _active: boolean, txParams?: Tx): Promise<any>;
    owner(txParams?: Tx): Promise<any>;
    changeOwner(_newOwner: string, txParams?: Tx): Promise<any>;
    getFullUser(_user: string, txParams?: Tx): Promise<any>;
}
