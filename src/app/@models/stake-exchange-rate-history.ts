import {FixedNumber} from "ethers";

export abstract class StakeExchangeRateHistory {
  rate: FixedNumber;
  timestamp: FixedNumber;
}
