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
const sloffle_1 = require("sloffle");
const fs = require("fs");
const UserContractLookup_1 = require("../wrappedContracts/UserContractLookup");
function migrateUserRegistryContracts(web3) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const configFile = JSON.parse(fs.readFileSync('connection-config.json', 'utf8'));
            const sloffle = new sloffle_1.Sloffle(web3);
            const privateKeyDeployment = configFile.develop.deployKey.startsWith('0x') ?
                configFile.develop.deployKey : '0x' + configFile.develop.deployKey;
            const userContractLookupWeb3 = yield sloffle.deploy('dist/contracts/UserContractLookup.json', [], { privateKey: privateKeyDeployment });
            const userLogicWeb3 = yield sloffle.deploy('dist/contracts/UserLogic.json', [userContractLookupWeb3._address], { privateKey: privateKeyDeployment });
            const userDbWeb3 = yield sloffle.deploy('dist/contracts/UserDB.json', [userLogicWeb3._address], { privateKey: privateKeyDeployment });
            const userContractLookup = new UserContractLookup_1.UserContractLookup(web3, userContractLookupWeb3._address);
            yield userContractLookup.init(userLogicWeb3._address, userDbWeb3._address, { privateKey: privateKeyDeployment });
            resolve(sloffle.deployedContracts);
        }));
    });
}
exports.migrateUserRegistryContracts = migrateUserRegistryContracts;
//# sourceMappingURL=migrateContracts.js.map