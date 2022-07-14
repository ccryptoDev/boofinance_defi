// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {MoralisStagingEnvironment} from "./configurations/moralis-environments";
import {parseEther} from "ethers/lib/utils";
import {AppEnvironment} from "../app/@models/app-environment";
import {ProductionTokensEnvironment, ProductionLPTokensEnvironment, ProductionSingleTokensEnvironment} from "./configurations/production-tokens-environment";

export const environment: AppEnvironment = {
  version: '1.7.0',
  production: false,
  moralis: MoralisStagingEnvironment,
  tokens: ProductionTokensEnvironment,
  tokensLP: ProductionLPTokensEnvironment,
  tokensSingle: ProductionSingleTokensEnvironment,
  minimumAllowanceToRequestApproval: parseEther('2000000000'),
  failedRequestsRetryThreshold: 5000,
  contractAddresses: {
    boofi: "0xB00F1ad977a949a3CCc389Ca1D1282A2946963b0",
    zBoofi: "0x67712c62d1deaebdef7401e59a9e34422e2ea87c",
    zBoofiStaking: "0x14c323348e798da2dbbc79acbca34c7221e8148d",
    hauntedHouse: "0xb178bd23876dd9f8aa60e7fdb0a2209fe2d7a9ab",
    hauntedHouseAvaxDepositHelper: "0x331f34908624823c055558ca2a59a1205e27ded2",
    hauntedHouseHarvestHelper: "0xdE7b76057DfCB84382a85275e188EC7165e690C9",
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
