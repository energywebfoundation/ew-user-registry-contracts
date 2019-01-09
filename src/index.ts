export { UserLogic } from './wrappedContracts/UserLogic';
export { UserContractLookup } from './wrappedContracts/UserContractLookup';
export { migrateUserRegistryContracts } from './utils/migrateContracts';

import UserDBJSON from '../../dist/contracts/UserDB.json';
import UserLogicJSON from '../../dist/contracts/UserLogic.json';
import UserContractLookupJSON from '../../dist/contracts/UserContractLookup.json';
export { UserDBJSON, UserLogicJSON, UserContractLookupJSON };
