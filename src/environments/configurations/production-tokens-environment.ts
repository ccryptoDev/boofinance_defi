import {Token} from "../../app/@models/token";
import {FormatUnitsPipeStyleEnum} from "../../app/@enums/format-units-pipe-style.enum";
import {PriceFetchStrategyEnum} from "../../app/@enums/price-fetch-strategy.enum";

/**

   NOTES:  We keep the priceStrategy within the dApp for consistency with the Oracle, but it has no incidence
           on the dApp it self.
           LP Tokens from trader Joe, use the PriceFetchStrategyDefault that fetches data from Moralis pricing API
           other exchanges use the PriceFetchStrategyLP in where we calculate the value manually

**/

export const AvaxToken: Token = {
  // General
  address: "0x0000000000000000000000000000000000000000",
  chainId: 43114,
  name: "Avalanche",
  symbol: "AVAX",
  decimals: 18,
  logoURI: "./assets/images/tokens/AVAX.png",
  availableInTheCauldron: true,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/trade?outputCurrency=0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#E84142",
  displayAsHotToken: true,
  glowColor: "#E84142",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const WavaxToken: Token = {
  // General
  address: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
  chainId: 43114,
  name: "Wrapped AVAX",
  symbol: "WAVAX",
  decimals: 18,
  logoURI: "./assets/images/tokens/WAVAX.png",
  availableInTheCauldron: true,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/trade?outputCurrency=0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#272136",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const BoofiToken: Token = {
  // General
  address: "0xb00f1ad977a949a3ccc389ca1d1282a2946963b0",
  chainId: 43114,
  name: "BOOFI",
  symbol: "BOOFI",
  decimals: 18,
  logoURI: "https://raw.githubusercontent.com/BooFinance/assets/main/logo.png",
  availableInTheCauldron: false,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/trade?outputCurrency=0xb00f1ad977a949a3ccc389ca1d1282a2946963b0",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#EFF6FA",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const ZBoofiToken: Token = {
  // General
  address: "0x67712c62d1deaebdef7401e59a9e34422e2ea87c",
  chainId: 43114,
  name: "zBOOFI",
  symbol: "zBOOFI",
  decimals: 18,
  logoURI: "https://www.boofinance.io/assets/images/general/boofi-zombie.svg",
  availableInTheCauldron: false,
  // dApp Only
  getTokensUrl: "",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#927503",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const PangolinToken: Token = {
  // General
  address: "0x60781c2586d68229fde47564546784ab3faca982",
  chainId: 43114,
  name: "Pangolin",
  symbol: "PNG",
  decimals: 18,
  logoURI: "https://raw.githubusercontent.com/pangolindex/tokens/main/assets/0x60781C2586D68229fde47564546784ab3fACA982/logo_48.png",
  availableInTheCauldron: true,
  // dApp Only
  getTokensUrl : "https://app.pangolin.exchange/#/swap?outputCurrency=0x60781C2586D68229fde47564546784ab3fACA982",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#FF6B00",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const LydiaToken: Token = {
  // General
  chainId: 43114,
  address: "0x4c9b4e1ac6f24cde3660d5e4ef1ebf77c710c084",
  decimals: 18,
  name: "Lydia Finance",
  symbol: "LYD",
  logoURI: "https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x4C9B4E1AC6F24CdE3660D5E4Ef1eBF77C710C084/logo.png",
  availableInTheCauldron: true,
  // dApp Only
  getTokensUrl: "https://exchange.lydia.finance/#/swap?outputCurrency=0x4C9B4E1AC6F24CdE3660D5E4Ef1eBF77C710C084",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#21254E",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const WethToken: Token = {
  // General
  chainId: 43114,
  address: "0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab",
  name: "Wrapped Ether",
  symbol: "WETH.e",
  decimals: 18,
  logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/WETH/logo.png",
  availableInTheCauldron: true,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/trade?outputCurrency=0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#808182",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const PenguinToken: Token = {
  // General
  chainId: 43114,
  address: "0xe896cdeaac9615145c0ca09c8cd5c25bced6384c",
  name: "PenguinToken",
  symbol: "PEFI",
  decimals: 18,
  logoURI: "https://raw.githubusercontent.com/Penguin-Finance/png-files/main/pefiv2_250x250.png",
  availableInTheCauldron: false,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/trade?outputCurrency=0xe896cdeaac9615145c0ca09c8cd5c25bced6384c",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#E64242",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
}

export const JoeToken: Token = {
  // General
  chainId: 43114,
  address: "0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd",
  name: "JoeToken",
  symbol: "JOE",
  decimals: 18,
  logoURI: "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x23fc76B53882d8dcaB1900f0D3C1C0c504Ffb8E3/logo.png",
  availableInTheCauldron: false,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/trade?outputCurrency=0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#F27069",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const XjoeToken: Token = {
  // General
  chainId: 43114,
  address: "0x57319d41f71e81f3c65f2a47ca4e001ebafd4f33",
  name: "JoeBar",
  symbol: "xJoe",
  decimals: 18,
  logoURI: "./assets/images/tokens/xJoe.png",
  availableInTheCauldron: true,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/stake",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#F1C4CF",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const BenqiToken: Token = {
  // General
  chainId: 43114,
  address: "0x8729438eb15e2c8b576fcc6aecda6a148776c0f5",
  name: "BENQI",
  symbol: "QI",
  decimals: 18,
  logoURI: "./assets/images/tokens/QI.png",
  availableInTheCauldron: true,
  // dApp Only
  getTokensUrl: "https://app.pangolin.exchange/#/swap?outputCurrency=0x8729438eb15e2c8b576fcc6aecda6a148776c0f5",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#00B0E9",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const MagicInternetMoneyToken: Token = {
  // General
  chainId: 43114,
  address: "0x130966628846bfd36ff31a822705796e8cb8c18d",
  name: "Magic Internet Money",
  symbol: "MIM",
  decimals: 18,
  logoURI: "./assets/images/tokens/MIM.png",
  availableInTheCauldron: true,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/trade?outputCurrency=0x130966628846BFd36ff31a822705796e8cb8C18D",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#FDD855",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const WbtceToken: Token = {
  // General
  chainId: 43114,
  address: "0x50b7545627a5162f82a992c33b87adc75187b218",
  name: "Wrapped Bitcoin",
  symbol: "WBTC.e",
  decimals: 8,
  logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/WBTC/logo.png",
  availableInTheCauldron: true,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/trade?outputCurrency=0x50b7545627a5162f82a992c33b87adc75187b218",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#262136",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const ChainLinkToken: Token = {
  // General
  chainId: 43114,
  address: "0x5947bb275c521040051d82396192181b413227a3",
  name: "Chainlink",
  symbol: "LINK.e",
  decimals: 18,
  logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/LINK/logo.png",
  availableInTheCauldron: true,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/trade?outputCurrency=0x5947bb275c521040051d82396192181b413227a3",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#2C5CDB",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const UsdcToken: Token = {
  // General
  chainId: 43114,
  address: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
  name: "USD Coin",
  symbol: "USDC",
  decimals: 6,
  logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/USDC/logo.png",
  availableInTheCauldron: false,
  // dApp Only
  getTokensUrl: `https://traderjoexyz.com/trade?outputCurrency=0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e`,
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#2775C8",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const UsdceToken: Token = {
  // General
  chainId: 43114,
  address: "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
  name: "USD Coin",
  symbol: "USDC.e",
  decimals: 6,
  logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/USDC/logo.png",
  availableInTheCauldron: true,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/trade?outputCurrency=0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#2775C8",
  glowColor: "#2775C8",
  displayAsHotToken: true,
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const DaieToken: Token = {
  // General
  chainId: 43114,
  address: "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
  name: "DAI",
  symbol: "DAI.e",
  decimals: 18,
  logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/DAI/logo.png",
  availableInTheCauldron: true,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/trade?outputCurrency=0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#FABD3C",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const UsdteToken: Token = {
  // General
  chainId: 43114,
  address: "0xc7198437980c041c805a1edcba50c1ce5db95118",
  name: "Tether USD",
  symbol: "USDT.e",
  decimals: 6,
  logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/USDT/logo.png",
  availableInTheCauldron: true,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/trade?outputCurrency=0xc7198437980c041c805a1edcba50c1ce5db95118",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#27A17C",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const SpellToken: Token = {
  // General
  chainId: 43114,
  address: "0xce1bffbd5374dac86a2893119683f4911a2f7814",
  name: "Spell Token",
  symbol: "SPELL",
  decimals: 18,
  logoURI: "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xCE1bFFBD5374Dac86a2893119683F4911a2F7814/logo.png",
  availableInTheCauldron: false,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/trade?outputCurrency=0xce1bffbd5374dac86a2893119683f4911a2f7814",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#A4A3F8",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const SnobToken: Token = {
  // General
  chainId: 43114,
  address: "0xc38f41a296a4493ff429f1238e030924a1542e50",
  name: "Snowball",
  symbol: "SNOB",
  decimals: 18,
  logoURI: "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xC38f41A296A4493Ff429F1238e030924A1542e50/logo.png",
  availableInTheCauldron: false,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/trade?outputCurrency=0xc38f41a296a4493ff429f1238e030924a1542e50",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#A4A3F8",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const JewelToken: Token = {
  // General
  chainId: 43114,
  address: "0x4f60a160D8C2DDdaAfe16FCC57566dB84D674BD6",
  name: "Jewels",
  symbol: "JEWEL",
  decimals: 18,
  logoURI: "./assets/images/tokens/JEWEL.png",
  availableInTheCauldron: false,
  // dApp Only
  getTokensUrl: "https://app.pangolin.exchange/#/swap?outputCurrency=0x4f60a160D8C2DDdaAfe16FCC57566dB84D674BD6",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#A4A3F8",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const IceToken: Token = {
  // General
  chainId: 43114,
  address: "0xe0Ce60AF0850bF54072635e66E79Df17082A1109",
  name: "IceToken",
  symbol: "ICE",
  decimals: 18,
  logoURI: "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xe0Ce60AF0850bF54072635e66E79Df17082A1109/logo.png",
  availableInTheCauldron: false,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/trade?outputCurrency=0xe0Ce60AF0850bF54072635e66E79Df17082A1109",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#A4A3F8",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const RocoToken: Token = {
  // General
  chainId: 43114,
  address: "0xb2a85C5ECea99187A977aC34303b80AcbDdFa208",
  name: "ROCO",
  symbol: "ROCO",
  decimals: 18,
  logoURI: "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xb2a85C5ECea99187A977aC34303b80AcbDdFa208/logo.png",
  availableInTheCauldron: false,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/trade?outputCurrency=0xb2a85C5ECea99187A977aC34303b80AcbDdFa208",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#A4A3F8",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const EggToken: Token = {
  // General
  chainId: 43114,
  address: "0x7761E2338B35bCEB6BdA6ce477EF012bde7aE611",
  name: "chikn egg",
  symbol: "EGG",
  decimals: 18,
  logoURI: "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x7761E2338B35bCEB6BdA6ce477EF012bde7aE611/logo.png",
  availableInTheCauldron: false,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/trade?outputCurrency=0x7761E2338B35bCEB6BdA6ce477EF012bde7aE611",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#A4A3F8",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const CraToken: Token = {
  // General
  chainId: 43114,
  address: "0xA32608e873F9DdEF944B24798db69d80Bbb4d1ed",
  name: "CRA",
  symbol: "CRA",
  decimals: 18,
  logoURI: "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xA32608e873F9DdEF944B24798db69d80Bbb4d1ed/logo.png",
  availableInTheCauldron: false,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/trade?outputCurrency=0xA32608e873F9DdEF944B24798db69d80Bbb4d1ed",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#A4A3F8",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const PlatypusToken: Token = {
  // General
  chainId: 43114,
  address: "0x22d4002028f537599bE9f666d1c4Fa138522f9c8",
  name: "Platypus",
  symbol: "PTP",
  decimals: 18,
  logoURI: "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x22d4002028f537599bE9f666d1c4Fa138522f9c8/logo.png",
  availableInTheCauldron: false,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/trade?outputCurrency=0x22d4002028f537599bE9f666d1c4Fa138522f9c8",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#A4A3F8",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.Default,
};

export const ProductionSingleTokens: Token[] = [
  AvaxToken,
  WavaxToken,
  BoofiToken,
  PangolinToken,
  LydiaToken,
  WethToken,
  PenguinToken,
  JoeToken,
  XjoeToken,
  BenqiToken,
  MagicInternetMoneyToken,
  WbtceToken,
  ChainLinkToken,
  UsdcToken,
  UsdceToken,
  UsdteToken,
  DaieToken,
  SpellToken,
  SnobToken,
  JewelToken
];


export const JoePtpAvax: Token = {
  // General
  chainId: 43114,
  address: "0xcdfd91eea657cc2701117fe9711c9a4f61feed23",
  decimals: 18,
  name: "Trader Joe",
  symbol: "PTP/AVAX",
  logoURI: "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x22d4002028f537599bE9f666d1c4Fa138522f9c8/logo.png",
  liquidityPairDetails: {
    pairLogoURI: "./assets/images/tokens/AVAX.png",
    token0Address: PlatypusToken.address,
    token1Address: WavaxToken.address,
  },
  availableInTheCauldron: true,
  // dApp Only
  getTokensUrl: "https://traderjoexyz.com/pool/AVAX/0x22d4002028f537599bE9f666d1c4Fa138522f9c8",
  maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
  compositionChartBackgroundColor: "#00A1D7",
  displayAsNewToken: true,
  displayAsHotToken: true,
  glowColor: "#2D61DD",
  // Oracle Only
  priceStrategy: PriceFetchStrategyEnum.LP,
};

export const JoeBoofiAvax: Token = {
    // General
    chainId: 43114,
    address: "0x3ff33bf2caf70ace9efd6e4c78837be083e34b3a",
    decimals: 18,
    name: "Trader Joe",
    symbol: "BOOFI/AVAX",
    logoURI: "https://raw.githubusercontent.com/BooFinance/assets/main/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: BoofiToken.address,
      token1Address: WavaxToken.address
    },
    availableInTheCauldron: true,
    displayAsHotToken: true,
    // dApp Only
    getTokensUrl: "https://traderjoexyz.com/pool/AVAX/0xB00F1ad977a949a3CCc389Ca1D1282A2946963b0",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#E84142",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
};

export const ProductionLiquidityPoolTokens: Token[] = [
  /**
    Trader Joe LPs
  **/
  {
    // General
    chainId: 43114,
    address: "0x701c8e84e9ac24b54b957d549cddf544b3e9fb83",
    decimals: 18,
    name: "Trader Joe",
    symbol: "BOOFI/PEFI",
    logoURI: "https://raw.githubusercontent.com/BooFinance/assets/main/logo.png",
    liquidityPairDetails: {
      pairLogoURI:  "https://raw.githubusercontent.com/Penguin-Finance/png-files/main/pefiv2_250x250.png",
      token0Address: BoofiToken.address,
      token1Address: PenguinToken.address
    },
    availableInTheCauldron: true,
    displayAsHotToken: true,
    // dApp Only
    getTokensUrl: "https://traderjoexyz.com/pool/0xB00F1ad977a949a3CCc389Ca1D1282A2946963b0/0xe896CDeaAC9615145c0cA09C8Cd5C25bced6384c",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#9F8867",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0xfe15c2695f1f920da45c30aae47d11de51007af9",
    decimals: 18,
    name: "Trader Joe",
    symbol: "WETH.e/AVAX",
    logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/WETH/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: WethToken.address,
      token1Address: WavaxToken.address
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://traderjoexyz.com/pool/AVAX/0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#0F0F0F",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0xa389f9430876455c36478deea9769b7ca4e3ddb1",
    decimals: 18,
    name: "Trader Joe",
    symbol: "USDC.e/AVAX",
    logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/USDC/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: UsdceToken.address,
      token1Address: WavaxToken.address
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://traderjoexyz.com/pool/AVAX/0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.ALL_DECIMALS,
    compositionChartBackgroundColor: "#2875C9",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0xd5a37dc5c9a396a03dd1136fc76a1a02b1c88ffa",
    decimals: 18,
    name: "Trader Joe",
    symbol: "WBTC.e/AVAX",
    logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/WBTC/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: WbtceToken.address,
      token1Address: WavaxToken.address
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://traderjoexyz.com/pool/AVAX/0x50b7545627a5162f82a992c33b87adc75187b218",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.ALL_DECIMALS,
    compositionChartBackgroundColor: "#31273F",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0xb78c8238bd907c42be45aebdb4a8c8a5d7b49755",
    decimals: 18,
    name: "Trader Joe",
    symbol: "PEFI/AVAX",
    logoURI: "https://raw.githubusercontent.com/Penguin-Finance/png-files/main/pefiv2_250x250.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: WavaxToken.address,
      token1Address: PenguinToken.address
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://traderjoexyz.com/pool/AVAX/0xe896CDeaAC9615145c0cA09C8Cd5C25bced6384c",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#E84142",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0x2a8a315e82f85d1f0658c5d66a452bbdd9356783",
    decimals: 18,
    name: "Trader Joe",
    symbol: "USDC.e/USDC",
    logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/USDC/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/USDC/logo.png",
      token0Address: UsdceToken.address,
      token1Address: UsdcToken.address,
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://traderjoexyz.com/pool/0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664/0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.ALL_DECIMALS,
    compositionChartBackgroundColor: "#2674C8",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0x454e67025631c065d3cfad6d71e6892f74487a15",
    decimals: 18,
    name: "Trader Joe",
    symbol: "JOE/AVAX",
    logoURI: "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: JoeToken.address,
      token1Address: WavaxToken.address,
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://traderjoexyz.com/pool/AVAX/0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#F2716A",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0x67926d973cd8ee876ad210faaf7dffa99e414acf",
    decimals: 18,
    name: "Trader Joe",
    symbol: "JOE/USDC.e",
    logoURI: "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/USDC/logo.png",
      token0Address: JoeToken.address,
      token1Address: UsdceToken.address,
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://traderjoexyz.com/pool/0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd/0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.ALL_DECIMALS,
    compositionChartBackgroundColor: "#F2716A",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0x781655d802670bba3c89aebaaea59d3182fd755d",
    decimals: 18,
    name: "Trader Joe",
    symbol: "MIM/AVAX",
    logoURI: MagicInternetMoneyToken.logoURI,
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: MagicInternetMoneyToken.address,
      token1Address: WavaxToken.address,
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://traderjoexyz.com/pool/AVAX/0x130966628846bfd36ff31a822705796e8cb8c18d",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#FED955",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0xed8cbd9f0ce3c6986b22002f03c6475ceb7a6256",
    decimals: 18,
    name: "Trader Joe",
    symbol: "USDT.e/AVAX",
    logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/USDT/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: WavaxToken.address,
      token1Address: UsdteToken.address,
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://traderjoexyz.com/pool/AVAX/0xc7198437980c041c805a1edcba50c1ce5db95118",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.ALL_DECIMALS,
    compositionChartBackgroundColor: "#27A17C",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0x6f3a0c89f611ef5dc9d96650324ac633d02265d3",
    decimals: 18,
    name: "Trader Joe",
    symbol: "LINK.e/AVAX",
    logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/LINK/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: ChainLinkToken.address,
      token1Address: WavaxToken.address,
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://traderjoexyz.com/pool/AVAX/0x5947bb275c521040051d82396192181b413227a3",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#2958D9",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0x62cf16bf2bc053e7102e2ac1dee5029b94008d99",
    decimals: 18,
    name: "Trader Joe",
    symbol: "SPELL/AVAX",
    logoURI: "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xCE1bFFBD5374Dac86a2893119683F4911a2F7814/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: WavaxToken.address,
      token1Address: SpellToken.address,
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://traderjoexyz.com/pool/AVAX/0xCE1bFFBD5374Dac86a2893119683F4911a2F7814",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#7E7AF6",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0x8fB5bD3aC8eFD05DACae82F512dD03e14aAdAb73",
    decimals: 18,
    name: "Trader Joe",
    symbol: "SNOB/AVAX",
    logoURI: "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xC38f41A296A4493Ff429F1238e030924A1542e50/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: WavaxToken.address,
      token1Address: SnobToken.address,
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://traderjoexyz.com/pool/AVAX/0xC38f41A296A4493Ff429F1238e030924A1542e50",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#7E7AF6",
    displayAsNewToken: false,
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0xF8Ba19769AaE90bEF1d6B00aAEE38204Ed48976a",
    decimals: 18,
    name: "Trader Joe",
    symbol: "ICE/AVAX",
    logoURI: "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xe0Ce60AF0850bF54072635e66E79Df17082A1109/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: WavaxToken.address,
      token1Address: IceToken.address,
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://traderjoexyz.com/pool/AVAX/0xe0Ce60AF0850bF54072635e66E79Df17082A1109",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#3FDCFF",
    displayAsNewToken: true,
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0x3052a75dfD7A9D9B0F81E510E01d3Fe80A9e7ec7",
    decimals: 18,
    name: "Trader Joe",
    symbol: "EGG/AVAX",
    logoURI: "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x7761E2338B35bCEB6BdA6ce477EF012bde7aE611/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: EggToken.address,
      token1Address: WavaxToken.address,
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://traderjoexyz.com/pool/AVAX/0x7761E2338B35bCEB6BdA6ce477EF012bde7aE611",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#E55453",
    displayAsNewToken: true,
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0x140CAc5f0e05cBEc857e65353839FddD0D8482C1",
    decimals: 18,
    name: "Trader Joe",
    symbol: "CRA/AVAX",
    logoURI: "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xA32608e873F9DdEF944B24798db69d80Bbb4d1ed/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: CraToken.address,
      token1Address: WavaxToken.address,
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://traderjoexyz.com/pool/AVAX/0xA32608e873F9DdEF944B24798db69d80Bbb4d1ed",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#00C9F3",
    displayAsNewToken: true,
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  JoePtpAvax,
  JoeBoofiAvax,
  /**
    Pangolin LPs
  **/
  {
    // General
    chainId: 43114,
    address: "0xe64cc27ed4a54ac4fdee31efc56d363af2ee5a13",
    decimals: 18,
    name: "Pangolin",
    symbol: "BOOFI/AVAX",
    logoURI: "https://raw.githubusercontent.com/BooFinance/assets/main/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: BoofiToken.address,
      token1Address: WavaxToken.address
    },
    availableInTheCauldron: true,
    displayAsHotToken: true,
    // dApp Only
    getTokensUrl: "https://app.pangolin.exchange/#/add/AVAX/0xB00F1ad977a949a3CCc389Ca1D1282A2946963b0",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#F1F8FC",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0x7c05d54fc5cb6e4ad87c6f5db3b807c94bb89c52",
    decimals: 18,
    name: "Pangolin",
    symbol: "WETH.e/AVAX",
    logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/WETH/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: WethToken.address,
      token1Address: WavaxToken.address
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://app.pangolin.exchange/#/add/AVAX/0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#828384",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0x221caccd55f16b5176e14c0e9dbaf9c6807c83c9",
    decimals: 18,
    name: "Pangolin",
    symbol: "USDC.e/DAI.e",
    logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/USDC/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/DAI/logo.png",
      token0Address: UsdceToken.address,
      token1Address: DaieToken.address
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://app.pangolin.exchange/#/add/0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664/0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.ALL_DECIMALS,
    compositionChartBackgroundColor: "#2775C9",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0xc13e562d92f7527c4389cd29c67dabb0667863ea",
    decimals: 18,
    name: "Pangolin",
    symbol: "USDC.e/USDT.e",
    logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/USDC/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/USDT/logo.png",
      token0Address: UsdceToken.address,
      token1Address: UsdteToken.address
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://app.pangolin.exchange/#/add/0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664/0xc7198437980c041c805a1edcba50c1ce5db95118",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.ALL_DECIMALS,
    compositionChartBackgroundColor: "#2775C9",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0xba09679ab223c6bdaf44d45ba2d7279959289ab0",
    decimals: 18,
    name: "Pangolin",
    symbol: "DAI.e/AVAX",
    logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/DAI/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: WavaxToken.address,
      token1Address: DaieToken.address,
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://app.pangolin.exchange/#/add/AVAX/0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#FABF41",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0xbd918ed441767fe7924e99f6a0e0b568ac1970d9",
    decimals: 18,
    name: "Pangolin",
    symbol: "USDC.e/AVAX",
    logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/USDC/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: UsdceToken.address,
      token1Address: WavaxToken.address
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://app.pangolin.exchange/#/add/AVAX/0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.ALL_DECIMALS,
    compositionChartBackgroundColor: "#287AD3",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0x5764b8d8039c6e32f1e5d8de8da05ddf974ef5d3",
    decimals: 18,
    name: "Pangolin",
    symbol: "WBTC.e/AVAX",
    logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/WBTC/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: WbtceToken.address,
      token1Address: WavaxToken.address
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://app.pangolin.exchange/#/add/AVAX/0x50b7545627a5162f82a992c33b87adc75187b218",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.ALL_DECIMALS,
    compositionChartBackgroundColor: "#2A2239",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0xd7538cabbf8605bde1f4901b47b8d42c61de0367",
    decimals: 18,
    name: "Pangolin",
    symbol: "PNG/AVAX",
    logoURI: "https://raw.githubusercontent.com/pangolindex/tokens/main/assets/0x60781C2586D68229fde47564546784ab3fACA982/logo_48.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: PangolinToken.address,
      token1Address: WavaxToken.address
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://app.pangolin.exchange/#/add/AVAX/0x60781C2586D68229fde47564546784ab3fACA982",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#FF6B00",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0xc33ac18900b2f63dfb60b554b1f53cd5b474d4cd",
    decimals: 18,
    name: "Pangolin",
    symbol: "PNG/USDC.e",
    logoURI: "https://raw.githubusercontent.com/pangolindex/tokens/main/assets/0x60781C2586D68229fde47564546784ab3fACA982/logo_48.png",
    liquidityPairDetails: {
      pairLogoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/USDC/logo.png",
      token0Address: PangolinToken.address,
      token1Address: UsdceToken.address
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://app.pangolin.exchange/#/add/0x60781C2586D68229fde47564546784ab3fACA982/0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.ALL_DECIMALS,
    compositionChartBackgroundColor: "#FF6B00",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0xE75eD6E50e3e2dc6b06FAf38b943560BD22e343B",
    decimals: 18,
    name: "Pangolin",
    symbol: "MIM/USDC.e",
    logoURI: MagicInternetMoneyToken.logoURI,
    liquidityPairDetails: {
      pairLogoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/USDC/logo.png",
      token0Address: MagicInternetMoneyToken.address,
      token1Address: UsdceToken.address
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://app.pangolin.exchange/#/add/0x130966628846bfd36ff31a822705796e8cb8c18d/0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.ALL_DECIMALS,
    compositionChartBackgroundColor: "#FED955",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0xe28984e1ee8d431346d32bec9ec800efb643eef4",
    decimals: 18,
    name: "Pangolin",
    symbol: "USDT.e/AVAX",
    logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/USDT/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: WavaxToken.address,
      token1Address: UsdteToken.address,
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://app.pangolin.exchange/#/add/AVAX/0xc7198437980c041c805a1edcba50c1ce5db95118",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.ALL_DECIMALS,
    compositionChartBackgroundColor: "#2AA27D",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0x494dd9f783daf777d3fb4303da4de795953592d0",
    decimals: 18,
    name: "Pangolin",
    symbol: "PEFI/AVAX",
    logoURI: "https://raw.githubusercontent.com/Penguin-Finance/png-files/main/pefiv2_250x250.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: WavaxToken.address,
      token1Address: PenguinToken.address,
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://app.pangolin.exchange/#/add/AVAX/0xe896CDeaAC9615145c0cA09C8Cd5C25bced6384c",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#000000",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0xd4cbc976e1a1a2bf6f4fea86deb3308d68638211",
    decimals: 18,
    name: "Pangolin",
    symbol: "SPELL/AVAX",
    logoURI: "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xCE1bFFBD5374Dac86a2893119683F4911a2F7814/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: WavaxToken.address,
      token1Address: SpellToken.address,
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://app.pangolin.exchange/#/add/AVAX/0xCE1bFFBD5374Dac86a2893119683F4911a2F7814",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#B3B2FB",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0x5875c368cddd5fb9bf2f410666ca5aad236dabd4",
    decimals: 18,
    name: "Pangolin",
    symbol: "LINK.e/AVAX",
    logoURI: "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/LINK/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: ChainLinkToken.address,
      token1Address: WavaxToken.address
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://app.pangolin.exchange/#/add/AVAX/0x5947bb275c521040051d82396192181b413227a3",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#1F56DA",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0x239aae4aabb5d60941d7dffaeafe8e063c63ab25",
    decimals: 18,
    name: "Pangolin",
    symbol: "MIM/AVAX",
    logoURI: MagicInternetMoneyToken.logoURI,
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: MagicInternetMoneyToken.address,
      token1Address: WavaxToken.address,
    },
    availableInTheCauldron: true,
    displayAsNewToken: false,
    // dApp Only
    getTokensUrl: "https://app.pangolin.exchange/#/add/AVAX/0x130966628846bfd36ff31a822705796e8cb8c18d",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#FED955",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0x9AA76aE9f804E7a70bA3Fb8395D0042079238E9C",
    decimals: 18,
    name: "Pangolin",
    symbol: "JEWEL/AVAX",
    logoURI: JewelToken.logoURI,
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: JewelToken.address,
      token1Address: WavaxToken.address
    },
    availableInTheCauldron: true,
    displayAsNewToken: false,
    // dApp Only
    getTokensUrl: "https://app.pangolin.exchange/#/add/AVAX/0x4f60a160D8C2DDdaAfe16FCC57566dB84D674BD6",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#1F56DA",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0x4a2cB99e8d91f82Cf10Fb97D43745A1f23e47caA",
    decimals: 18,
    name: "Pangolin",
    symbol: "ROCO/AVAX",
    logoURI: "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xb2a85C5ECea99187A977aC34303b80AcbDdFa208/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: RocoToken.address,
      token1Address: WavaxToken.address
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://app.pangolin.exchange/#/add/AVAX/0xb2a85C5ECea99187A977aC34303b80AcbDdFa208",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#FF3C3C",
    displayAsNewToken: true,
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  {
    // General
    chainId: 43114,
    address: "0x960FA242468746C59BC32513E2E1e1c24FDFaF3F",
    decimals: 18,
    name: "Pangolin",
    symbol: "CRA/AVAX",
    logoURI: "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xA32608e873F9DdEF944B24798db69d80Bbb4d1ed/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: CraToken.address,
      token1Address: WavaxToken.address
    },
    availableInTheCauldron: true,
    // dApp Only
    getTokensUrl: "https://app.pangolin.exchange/#/add/AVAX/0xA32608e873F9DdEF944B24798db69d80Bbb4d1ed",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#00C9F3",
    displayAsNewToken: true,
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
  /**
   Lydia LPs
   **/
  {
    // General
    chainId: 43114,
    address: "0xfa4575732a9c39b99d9e9f34ac93db34619d63d3",
    decimals: 18,
    name: "Lydia",
    symbol: "BOOFI/AVAX",
    logoURI: "https://raw.githubusercontent.com/BooFinance/assets/main/logo.png",
    liquidityPairDetails: {
      pairLogoURI: "./assets/images/tokens/AVAX.png",
      token0Address: BoofiToken.address,
      token1Address: WavaxToken.address
    },
    availableInTheCauldron: true,
    displayAsHotToken: true,
    // dApp Only
    getTokensUrl: "https://exchange.lydia.finance/#/add/AVAX/0xB00F1ad977a949a3CCc389Ca1D1282A2946963b0",
    maximumDecimalsToDisplay: FormatUnitsPipeStyleEnum.SIX_DECIMALS,
    compositionChartBackgroundColor: "#ffffff",
    // Oracle Only
    priceStrategy: PriceFetchStrategyEnum.LP,
  },
];

export const ProductionTokensEnvironment: Token[] = [
  ...ProductionSingleTokens,
  ...ProductionLiquidityPoolTokens
];

export const ProductionLPTokensEnvironment: Token[] = [
  ...ProductionLiquidityPoolTokens
];

export const ProductionSingleTokensEnvironment: Token[] = [
  ...ProductionSingleTokens
];
