export { UserLogic } from './wrappedContracts/UserLogic';
export { UserContractLookup } from './wrappedContracts/UserContractLookup';
export { migrateUserRegistryContracts } from './utils/migrateContracts';

import UserDBJSON from '../contract-build/UserDB.json';
import UserLogicJSON from '../contract-build/UserLogic.json';
import UserContractLookupJSON from '../contract-build/UserContractLookup.json';
export { UserDBJSON, UserLogicJSON, UserContractLookupJSON };
