import {BigNumber} from "ethers";

export abstract class CauldronUserTokenInfo {
  amountDeposited: BigNumber | null;
  pendingRewards: BigNumber | null;
}
