import {BigNumber} from "ethers";

export abstract class BoofiStakingDetails {
  apy?: number | null;
  apr?: number | null;
  zBoofiToBoofiExchangeRate?: BigNumber | null;
  boofiToZBoofiExchangeRate?: BigNumber | null;
}
