import {BigNumber} from "ethers";

export abstract class CauldronTokenDetails {
    tokenAddress?: string | null;
    liquidity?: BigNumber | null;
    liquidityInUsd?: number;
    percentageOfComposition?: number;
    volume?: BigNumber | null;
    volumeInUsd?: number;
    // Price in USD
    tokenPrice?: number | null;
    // Price in AVAX provided by the Smart Contract Oracle
    storedPrice?: BigNumber | null;
    apr?: number | null;
    apy?: number | null;
}
