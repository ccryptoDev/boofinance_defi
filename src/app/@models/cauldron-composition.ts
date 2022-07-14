import {FixedNumber} from "ethers";
import {CauldronTokenDetails} from "./cauldron-token-details";

export abstract class CauldronComposition {
  totalLiquidityInUsd: FixedNumber;
  tokensDetailsMap: Map<string, CauldronTokenDetails>;
}
