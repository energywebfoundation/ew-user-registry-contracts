export { UserLogic } from './wrappedContracts/UserLogic';
export { UserContractLookup } from './wrappedContracts/UserContractLookup';
export { migrateUserRegistryContracts } from './utils/migrateContracts';

import * as UserDBJSON from '../../dist/contracts/UserDB.json';
import * as UserLogicJSON from '../../dist/contracts/UserLogic.json';
import * as UserContractLookupJSON from '../../dist/contracts/UserContractLookup.json';
export { UserDBJSON, UserLogicJSON, UserContractLookupJSON };
