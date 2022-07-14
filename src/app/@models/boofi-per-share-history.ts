import {FixedNumber} from "ethers";

export abstract class BoofiPerShareHistory {
  boofiPerShare: FixedNumber;
  timestamp: FixedNumber;
}
