import {MoralisConfiguration} from "./moralis-configuration";
import {Token} from "./token";
import {BigNumber} from "ethers";

export class AppEnvironment {
  version: string;
  production: boolean;
  moralis: MoralisConfiguration;
  tokens: Token[];
  tokensLP: Token[];
  tokensSingle: Token[];
  minimumAllowanceToRequestApproval: BigNumber;
  failedRequestsRetryThreshold: number;
  contractAddresses: {
    boofi: string,
    zBoofi:  string,
    hauntedHouse: string,
    hauntedHouseAvaxDepositHelper: string,
    hauntedHouseHarvestHelper: string,
    zBoofiStaking: string,
    zBoofiWithdrawalFeeCalculator?: string,
    erc20DistributorAdjustableBips?: string,
    twapOracle?: string,
    cauldronPriceUpdater?: string,
    boofiStrategyBase?: string,
    boofiDistributor?: string,
  }
}
