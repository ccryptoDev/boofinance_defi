import {components} from "moralis/types/generated/web3Api";

export class MoralisConfiguration {
  serverUrl: string;
  applicationId: string;
  chain?: components["schemas"]["chainList"];
  tables: {
    transaction: 'EthTransactions' | 'AvaxTransactions',
    stakeWithdraw: string,
    wellOfSoulsHarvest: string,
    cauldronDeposit: string,
    cauldronWithdraw: string,
    wellOfSoulsContributor: string
  }
}
