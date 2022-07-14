import {TokenInfo} from "@uniswap/token-lists";
import {LiquidityPairDetails} from "./liquidity-pair-details";
import {FormatUnitsPipeStyleEnum} from "../@enums/format-units-pipe-style.enum";
import {PriceFetchStrategyEnum} from "../@enums/price-fetch-strategy.enum";

export class Token implements TokenInfo {
  /**
    General Attributes
  **/
  readonly address: string;
  readonly chainId: number;
  readonly decimals: number;
  readonly extensions?: { [p: string]: string | number | boolean | null };
  readonly logoURI: string;
  readonly name: string;
  readonly symbol: string;
  readonly tags?: string[];
  readonly liquidityPairDetails?: LiquidityPairDetails;
  readonly availableInTheCauldron?: boolean;
  /**
    dApp Only
  **/
  readonly getTokensUrl?: string;
  readonly maximumDecimalsToDisplay?: FormatUnitsPipeStyleEnum;
  readonly compositionChartBackgroundColor: string;
  readonly displayAsHotToken?: boolean;
  readonly displayAsNewToken?: boolean;
  // If the token has a Glow due having displayAsHotToken as true, we can over ride his color through the glowColor attribute
  readonly glowColor?: string;
  /**
    Oracle Only
  **/
  readonly priceStrategy?: PriceFetchStrategyEnum;
}
