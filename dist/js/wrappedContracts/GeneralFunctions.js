"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class GeneralFunctions {
    constructor(web3Contract) {
        this.web3Contract = web3Contract;
    }
    sendRaw(web3, privateKey, txParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const txData = {
                nonce: txParams.nonce,
                gasLimit: txParams.gas,
                gasPrice: 0,
                data: txParams.data,
                from: txParams.from,
                to: txParams.to
            };
            const txObject = yield web3.eth.accounts.signTransaction(txData, privateKey);
            return (yield web3.eth.sendSignedTransaction(txObject.rawTransaction));
        });
    }
    getWeb3Contract() {
        return this.web3Contract;
    }
}
exports.GeneralFunctions = GeneralFunctions;
//# sourceMappingURL=GeneralFunctions.js.map