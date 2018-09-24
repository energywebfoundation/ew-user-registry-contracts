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
const GeneralFunctions_1 = require("./GeneralFunctions");
const fs = require("fs");
class UserDB extends GeneralFunctions_1.GeneralFunctions {
    constructor(web3, address) {
        super(address ? new web3.eth.Contract(JSON.parse(fs.readFileSync('dist/contracts/UserDB.json', 'utf8').toString()).abi, address) : new web3.eth.Contract(JSON.parse(fs.readFileSync('dist/contracts/UserDB.json', 'utf8').toString()).abi, Object.keys(JSON.parse(fs.readFileSync('dist/contracts/UserDB.json', 'utf8').toString()).networks).length > 0 ? JSON.parse(fs.readFileSync('dist/contracts/UserDB.json', 'utf8').toString()).networks[Object.keys(JSON.parse(fs.readFileSync('dist/contracts/UserDB.json', 'utf8').toString()).networks)[0]].address : null));
        this.buildFile = JSON.parse(fs.readFileSync('dist/contracts/UserDB.json', 'utf8').toString());
        this.web3 = web3;
    }
    getAllLogChangeOwnerEvents(eventFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            let filterParams;
            if (eventFilter) {
                filterParams = {
                    fromBlock: eventFilter.fromBlock ? eventFilter.fromBlock : 0,
                    toBlock: eventFilter.toBlock ? eventFilter.toBlock : 'latest',
                    topics: eventFilter.topics ? eventFilter.topics : [null]
                };
            }
            else {
                filterParams = {
                    fromBlock: 0,
                    toBlock: 'latest'
                };
            }
            return yield this.web3Contract.getPastEvents('LogChangeOwner', filterParams);
        });
    }
    getAllEvents(eventFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            let filterParams;
            if (eventFilter) {
                filterParams = {
                    fromBlock: eventFilter.fromBlock ? eventFilter.fromBlock : 0,
                    toBlock: eventFilter.toBlock ? eventFilter.toBlock : 'latest',
                    topics: eventFilter.topics ? eventFilter.topics : [null]
                };
            }
            else {
                filterParams = {
                    fromBlock: 0,
                    toBlock: 'latest',
                    topics: [null]
                };
            }
            return yield this.web3Contract.getPastEvents('allEvents', filterParams);
        });
    }
    setOrganization(_user, _organization, txParams) {
        return __awaiter(this, void 0, void 0, function* () {
            let transactionParams;
            let gas;
            if (txParams) {
                if (txParams.privateKey) {
                    const privateKey = txParams.privateKey.startsWith("0x") ? txParams.privateKey : "0x" + txParams.privateKey;
                    txParams.from = this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
                    txParams.nonce = txParams.nonce ? txParams.nonce : (yield this.web3.eth.getTransactionCount(txParams.from));
                }
                if (!txParams.gas) {
                    gas = yield this.web3Contract.methods.setOrganization(_user, _organization)
                        .estimateGas({ from: txParams ? txParams.from : (yield this.web3.eth.getAccounts())[0] });
                    gas = Math.round(gas * 1.2);
                    txParams.gas = gas;
                }
                transactionParams = {
                    from: txParams.from ? txParams.from : (yield this.web3.eth.getAccounts())[0],
                    gas: txParams.gas ? txParams.gas : Math.round(gas * 1.1 + 21000),
                    gasPrice: 0,
                    nonce: txParams.nonce ? txParams.nonce : (yield this.web3.eth.getTransactionCount(txParams.from)),
                    data: txParams.data ? txParams.data : '',
                    to: this.web3Contract._address,
                    privateKey: txParams.privateKey ? txParams.privateKey : ""
                };
            }
            else {
                transactionParams = { from: (yield this.web3.eth.getAccounts())[0],
                    gas: Math.round(gas * 1.1 + 21000),
                    gasPrice: 0,
                    nonce: (yield this.web3.eth.getTransactionCount((yield this.web3.eth.getAccounts())[0])),
                    data: '',
                    to: this.web3Contract._address,
                    privateKey: ""
                };
            }
            if (transactionParams.privateKey !== '') {
                const txData = yield this.web3Contract.methods.setOrganization(_user, _organization)
                    .encodeABI();
                transactionParams.data = txData;
                return (yield this.sendRaw(this.web3, transactionParams.privateKey, transactionParams));
            }
            else {
                return yield this.web3Contract.methods.setOrganization(_user, _organization)
                    .send({ from: transactionParams.from, gas: transactionParams.gas });
            }
        });
    }
    setRoles(_user, _roles, txParams) {
        return __awaiter(this, void 0, void 0, function* () {
            let transactionParams;
            let gas;
            if (txParams) {
                if (txParams.privateKey) {
                    const privateKey = txParams.privateKey.startsWith("0x") ? txParams.privateKey : "0x" + txParams.privateKey;
                    txParams.from = this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
                    txParams.nonce = txParams.nonce ? txParams.nonce : (yield this.web3.eth.getTransactionCount(txParams.from));
                }
                if (!txParams.gas) {
                    gas = yield this.web3Contract.methods.setRoles(_user, _roles)
                        .estimateGas({ from: txParams ? txParams.from : (yield this.web3.eth.getAccounts())[0] });
                    gas = Math.round(gas * 1.2);
                    txParams.gas = gas;
                }
                transactionParams = {
                    from: txParams.from ? txParams.from : (yield this.web3.eth.getAccounts())[0],
                    gas: txParams.gas ? txParams.gas : Math.round(gas * 1.1 + 21000),
                    gasPrice: 0,
                    nonce: txParams.nonce ? txParams.nonce : (yield this.web3.eth.getTransactionCount(txParams.from)),
                    data: txParams.data ? txParams.data : '',
                    to: this.web3Contract._address,
                    privateKey: txParams.privateKey ? txParams.privateKey : ""
                };
            }
            else {
                transactionParams = { from: (yield this.web3.eth.getAccounts())[0],
                    gas: Math.round(gas * 1.1 + 21000),
                    gasPrice: 0,
                    nonce: (yield this.web3.eth.getTransactionCount((yield this.web3.eth.getAccounts())[0])),
                    data: '',
                    to: this.web3Contract._address,
                    privateKey: ""
                };
            }
            if (transactionParams.privateKey !== '') {
                const txData = yield this.web3Contract.methods.setRoles(_user, _roles)
                    .encodeABI();
                transactionParams.data = txData;
                return (yield this.sendRaw(this.web3, transactionParams.privateKey, transactionParams));
            }
            else {
                return yield this.web3Contract.methods.setRoles(_user, _roles)
                    .send({ from: transactionParams.from, gas: transactionParams.gas });
            }
        });
    }
    setUser(_user, _organization, txParams) {
        return __awaiter(this, void 0, void 0, function* () {
            let transactionParams;
            let gas;
            if (txParams) {
                if (txParams.privateKey) {
                    const privateKey = txParams.privateKey.startsWith("0x") ? txParams.privateKey : "0x" + txParams.privateKey;
                    txParams.from = this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
                    txParams.nonce = txParams.nonce ? txParams.nonce : (yield this.web3.eth.getTransactionCount(txParams.from));
                }
                if (!txParams.gas) {
                    gas = yield this.web3Contract.methods.setUser(_user, _organization)
                        .estimateGas({ from: txParams ? txParams.from : (yield this.web3.eth.getAccounts())[0] });
                    gas = Math.round(gas * 1.2);
                    txParams.gas = gas;
                }
                transactionParams = {
                    from: txParams.from ? txParams.from : (yield this.web3.eth.getAccounts())[0],
                    gas: txParams.gas ? txParams.gas : Math.round(gas * 1.1 + 21000),
                    gasPrice: 0,
                    nonce: txParams.nonce ? txParams.nonce : (yield this.web3.eth.getTransactionCount(txParams.from)),
                    data: txParams.data ? txParams.data : '',
                    to: this.web3Contract._address,
                    privateKey: txParams.privateKey ? txParams.privateKey : ""
                };
            }
            else {
                transactionParams = { from: (yield this.web3.eth.getAccounts())[0],
                    gas: Math.round(gas * 1.1 + 21000),
                    gasPrice: 0,
                    nonce: (yield this.web3.eth.getTransactionCount((yield this.web3.eth.getAccounts())[0])),
                    data: '',
                    to: this.web3Contract._address,
                    privateKey: ""
                };
            }
            if (transactionParams.privateKey !== '') {
                const txData = yield this.web3Contract.methods.setUser(_user, _organization)
                    .encodeABI();
                transactionParams.data = txData;
                return (yield this.sendRaw(this.web3, transactionParams.privateKey, transactionParams));
            }
            else {
                return yield this.web3Contract.methods.setUser(_user, _organization)
                    .send({ from: transactionParams.from, gas: transactionParams.gas });
            }
        });
    }
    setUserActive(_user, _active, txParams) {
        return __awaiter(this, void 0, void 0, function* () {
            let transactionParams;
            let gas;
            if (txParams) {
                if (txParams.privateKey) {
                    const privateKey = txParams.privateKey.startsWith("0x") ? txParams.privateKey : "0x" + txParams.privateKey;
                    txParams.from = this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
                    txParams.nonce = txParams.nonce ? txParams.nonce : (yield this.web3.eth.getTransactionCount(txParams.from));
                }
                if (!txParams.gas) {
                    gas = yield this.web3Contract.methods.setUserActive(_user, _active)
                        .estimateGas({ from: txParams ? txParams.from : (yield this.web3.eth.getAccounts())[0] });
                    gas = Math.round(gas * 1.2);
                    txParams.gas = gas;
                }
                transactionParams = {
                    from: txParams.from ? txParams.from : (yield this.web3.eth.getAccounts())[0],
                    gas: txParams.gas ? txParams.gas : Math.round(gas * 1.1 + 21000),
                    gasPrice: 0,
                    nonce: txParams.nonce ? txParams.nonce : (yield this.web3.eth.getTransactionCount(txParams.from)),
                    data: txParams.data ? txParams.data : '',
                    to: this.web3Contract._address,
                    privateKey: txParams.privateKey ? txParams.privateKey : ""
                };
            }
            else {
                transactionParams = { from: (yield this.web3.eth.getAccounts())[0],
                    gas: Math.round(gas * 1.1 + 21000),
                    gasPrice: 0,
                    nonce: (yield this.web3.eth.getTransactionCount((yield this.web3.eth.getAccounts())[0])),
                    data: '',
                    to: this.web3Contract._address,
                    privateKey: ""
                };
            }
            if (transactionParams.privateKey !== '') {
                const txData = yield this.web3Contract.methods.setUserActive(_user, _active)
                    .encodeABI();
                transactionParams.data = txData;
                return (yield this.sendRaw(this.web3, transactionParams.privateKey, transactionParams));
            }
            else {
                return yield this.web3Contract.methods.setUserActive(_user, _active)
                    .send({ from: transactionParams.from, gas: transactionParams.gas });
            }
        });
    }
    owner(txParams) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.web3Contract.methods.owner().call(txParams));
        });
    }
    changeOwner(_newOwner, txParams) {
        return __awaiter(this, void 0, void 0, function* () {
            let transactionParams;
            let gas;
            if (txParams) {
                if (txParams.privateKey) {
                    const privateKey = txParams.privateKey.startsWith("0x") ? txParams.privateKey : "0x" + txParams.privateKey;
                    txParams.from = this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
                    txParams.nonce = txParams.nonce ? txParams.nonce : (yield this.web3.eth.getTransactionCount(txParams.from));
                }
                if (!txParams.gas) {
                    gas = yield this.web3Contract.methods.changeOwner(_newOwner)
                        .estimateGas({ from: txParams ? txParams.from : (yield this.web3.eth.getAccounts())[0] });
                    gas = Math.round(gas * 1.2);
                    txParams.gas = gas;
                }
                transactionParams = {
                    from: txParams.from ? txParams.from : (yield this.web3.eth.getAccounts())[0],
                    gas: txParams.gas ? txParams.gas : Math.round(gas * 1.1 + 21000),
                    gasPrice: 0,
                    nonce: txParams.nonce ? txParams.nonce : (yield this.web3.eth.getTransactionCount(txParams.from)),
                    data: txParams.data ? txParams.data : '',
                    to: this.web3Contract._address,
                    privateKey: txParams.privateKey ? txParams.privateKey : ""
                };
            }
            else {
                transactionParams = { from: (yield this.web3.eth.getAccounts())[0],
                    gas: Math.round(gas * 1.1 + 21000),
                    gasPrice: 0,
                    nonce: (yield this.web3.eth.getTransactionCount((yield this.web3.eth.getAccounts())[0])),
                    data: '',
                    to: this.web3Contract._address,
                    privateKey: ""
                };
            }
            if (transactionParams.privateKey !== '') {
                const txData = yield this.web3Contract.methods.changeOwner(_newOwner)
                    .encodeABI();
                transactionParams.data = txData;
                return (yield this.sendRaw(this.web3, transactionParams.privateKey, transactionParams));
            }
            else {
                return yield this.web3Contract.methods.changeOwner(_newOwner)
                    .send({ from: transactionParams.from, gas: transactionParams.gas });
            }
        });
    }
    getFullUser(_user, txParams) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.web3Contract.methods.getFullUser(_user).call(txParams));
        });
    }
}
exports.UserDB = UserDB;
//# sourceMappingURL=UserDB.js.map