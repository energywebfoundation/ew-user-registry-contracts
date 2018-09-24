import { Tx, TransactionReceipt, Web3Type } from 'sloffle';
export declare class GeneralFunctions {
    web3Contract: any;
    constructor(web3Contract: any);
    sendRaw(web3: Web3Type, privateKey: string, txParams: Tx): Promise<TransactionReceipt>;
    getWeb3Contract(): any;
}
