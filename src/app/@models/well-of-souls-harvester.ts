import {BigNumber} from "ethers";
import {User} from "./user";

export class WellOfSoulsHarvester {
  userAddress: string;
  shares: BigNumber;
  totalHarvested: BigNumber | null;
  totalHarvestPoints: number;
  updatedAt: string;
  createdAt: string;
  user?: User | null;
  rank?: number | string | null;
}
