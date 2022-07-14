import {BigNumber} from "ethers";

export class TokenBalance {
  token_address: string;
  name: string;
  symbol: string;
  logo: string;
  thumbnail: string;
  decimals: number;
  balance: BigNumber;
}
