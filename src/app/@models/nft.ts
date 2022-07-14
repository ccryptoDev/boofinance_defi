import { BigNumber } from "ethers";
import internal from "stream";

export class Nft {
  tokenId: Number;
  name: String;
  price?: BigNumber;
  metadataUri?: string;
  nftImg?: string;
  muscle: Number;
  brain: Number;
  speed: Number;
}
