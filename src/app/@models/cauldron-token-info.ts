import {BigNumber} from "ethers";

export abstract class CauldronTokenInfo {
  tokenAddress: string;
  lastRewardTime: BigNumber; // Last time that BOOFI distribution occurred for this token
  lastCumulativeReward: BigNumber; // Value of cumulativeAvgZboofiPerWeightedDollar at last update
  storedPrice: BigNumber; // Latest value of token
  accZBOOFIPerShare: BigNumber; // Accumulated BOOFI per share, times ACC_BOOFI_PRECISION.
  totalShares: BigNumber; //total number of shares for the token
  totalTokens: BigNumber; //total number of tokens deposited
  multiplier: BigNumber; // multiplier for this token
  withdrawFeeBP: number; // Withdrawal fee in basis points
}
