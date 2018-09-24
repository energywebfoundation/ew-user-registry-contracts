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
class UserLogic extends GeneralFunctions_1.GeneralFunctions {
    constructor(web3, address) {
        super(address ? new web3.eth.Contract(JSON.parse(fs.readFileSync('dist/contracts/UserLogic.json', 'utf8').toString()).abi, address) : new web3.eth.Contract(JSON.parse(fs.readFileSync('dist/contracts/UserLogic.json', 'utf8').toString()).abi, Object.keys(JSON.parse(fs.readFileSync('dist/contracts/UserLogic.json', 'utf8').toString()).networks).length > 0 ? JSON.parse(fs.readFileSync('dist/contracts/UserLogic.json', 'utf8').toString()).networks[Object.keys(JSON.parse(fs.readFileSync('dist/contracts/UserLogic.json', 'utf8').toString()).networks)[0]].address : null));
        this.buildFile = JSON.parse(fs.readFileSync('dist/contracts/UserLogic.json', 'utf8').toString());
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
    deactivateUser(_user, txParams) {
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
                    gas = yield this.web3Contract.methods.deactivateUser(_user)
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
                const txData = yield this.web3Contract.methods.deactivateUser(_user)
                    .encodeABI();
                transactionParams.data = txData;
                return (yield this.sendRaw(this.web3, transactionParams.privateKey, transactionParams));
            }
            else {
                return yield this.web3Contract.methods.deactivateUser(_user)
                    .send({ from: transactionParams.from, gas: transactionParams.gas });
            }
        });
    }
    update(_newLogic, txParams) {
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
                    gas = yield this.web3Contract.methods.update(_newLogic)
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
                const txData = yield this.web3Contract.methods.update(_newLogic)
                    .encodeABI();
                transactionParams.data = txData;
                return (yield this.sendRaw(this.web3, transactionParams.privateKey, transactionParams));
            }
            else {
                return yield this.web3Contract.methods.update(_newLogic)
                    .send({ from: transactionParams.from, gas: transactionParams.gas });
            }
        });
    }
    getRolesRights(_user, txParams) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.web3Contract.methods.getRolesRights(_user).call(txParams));
        });
    }
    setRoles(_user, _rights, txParams) {
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
                    gas = yield this.web3Contract.methods.setRoles(_user, _rights)
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
                const txData = yield this.web3Contract.methods.setRoles(_user, _rights)
                    .encodeABI();
                transactionParams.data = txData;
                return (yield this.sendRaw(this.web3, transactionParams.privateKey, transactionParams));
            }
            else {
                return yield this.web3Contract.methods.setRoles(_user, _rights)
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
    userContractLookup(txParams) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.web3Contract.methods.userContractLookup().call(txParams));
        });
    }
    db(txParams) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.web3Contract.methods.db().call(txParams));
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
    isRole(_role, _caller, txParams) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.web3Contract.methods.isRole(_role, _caller).call(txParams));
        });
    }
    getFullUser(_user, txParams) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.web3Contract.methods.getFullUser(_user).call(txParams));
        });
    }
    doesUserExist(_user, txParams) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.web3Contract.methods.doesUserExist(_user).call(txParams));
        });
    }
    init(_database, _admin, txParams) {
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
                    gas = yield this.web3Contract.methods.init(_database, _admin)
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
                const txData = yield this.web3Contract.methods.init(_database, _admin)
                    .encodeABI();
                transactionParams.data = txData;
                return (yield this.sendRaw(this.web3, transactionParams.privateKey, transactionParams));
            }
            else {
                return yield this.web3Contract.methods.init(_database, _admin)
                    .send({ from: transactionParams.from, gas: transactionParams.gas });
            }
        });
    }
}
exports.UserLogic = UserLogic;
//# sourceMappingURL=UserLogic.js.map