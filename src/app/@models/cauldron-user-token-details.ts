import {BigNumber} from "@ethersproject/bignumber";

export abstract class CauldronUserTokenDetails {
  tokenAddress: string;
  userAddress: string;
  userLiquidity: BigNumber;
  hasLiquidity: boolean;
}
