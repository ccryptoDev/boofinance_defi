import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './@components/home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  NbAlertModule,
  NbButtonModule,
  NbContextMenuModule,
  NbDialogModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbMenuModule,
  NbSpinnerModule,
  NbThemeModule,
  NbToastrModule
} from '@nebular/theme';
import {NbEvaIconsModule} from '@nebular/eva-icons';
import {ParseUnitsPipe} from "./@pipes/parse-units.pipe";
import {FormatUnitsPipe} from "./@pipes/format-units.pipe";
import {CurrencyPipe, DecimalPipe} from "@angular/common";
import {StakeComponent} from './@components/stake/stake.component';
import {CauldronComponent} from './@components/cauldron/cauldron.component';
import {TokenPreviewComponent} from './@components/@shared/token-preview/token-preview.component';
import {NgxPaginationModule} from "ngx-pagination";
import {FilterTokensPipe} from './@pipes/filter-tokens.pipe';
import {FilterNftsPipe} from './@pipes/filter-nfts.pipe';
import {ReactiveFormsModule} from "@angular/forms";
import {FilterTokenBalancesPipe} from './@pipes/filter-token-balances.pipe';
import {Moralis} from "moralis";
import {environment} from "../environments/environment";
import {AuthenticationService} from "./@services/authentication.service";
import {TokensService} from "./@services/tokens.service";
import {CauldronCompositionComponent} from './@components/@modals/cauldron-composition/cauldron-composition.component';
import { VaultCompositionComponent } from './@components/@modals/vault-composition/vault-composition.component';
import {GoogleChartsModule} from "angular-google-charts";
import {SortTokensPipe} from './@pipes/sort-tokens.pipe';
import {HttpClientModule} from "@angular/common/http";
import {SortTokenBalancesPipe} from "./@pipes/sort-token-balances.pipe";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {SkeletonPipe} from './@pipes/skeleton.pipe';
import {StakeExchangeRateComponent} from './@components/stake/stake-exchange-rate/stake-exchange-rate.component';
import {WellOfSoulsComponent} from './@components/well-of-souls/well-of-souls.component';
import {UserConfigurationService} from "./@services/user-configuration.service";
import {CardInformationToggleComponent} from './@components/@shared/card-information-toggle/card-information-toggle.component';
import {SatPopoverModule} from "@ncstate/sat-popover";
import {AvatarPreviewComponent} from './@components/@shared/avatar-preview/avatar-preview.component';
import {ProfileEditorComponent} from "./@components/profile-editor/profile-editor.component";
import {EnumToArrayPipe} from "./@pipes/enum-to-array.pipe";
import {SortCauldronTokensDetailsPipe} from "./@pipes/sort-cauldron-token-details.pipe";
import { ConnectWalletButtonComponent } from './@components/@shared/connect-wallet-button/connect-wallet-button.component';
import {LoopNumberPipe} from "./@pipes/loop-number.pipe";
import { AlertCountdownComponent } from './@components/@shared/alert-countdown/alert-countdown.component';
import { VaultComponent } from './@components/vault/vault.component';
import { BattleComponent } from './@components/battle/battle.component';
import { NftPreviewComponent } from './@components/@shared/nft-preview/nft-preview.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        ParseUnitsPipe,
        FormatUnitsPipe,
        EnumToArrayPipe,
        StakeComponent,
        CauldronComponent,
        TokenPreviewComponent,
        FilterTokensPipe,
        FilterNftsPipe,
        FilterTokenBalancesPipe,
        CauldronCompositionComponent,
        VaultCompositionComponent,
        SortTokensPipe,
        SortTokenBalancesPipe,
        SkeletonPipe,
        SortCauldronTokensDetailsPipe,
        StakeExchangeRateComponent,
        WellOfSoulsComponent,
        CardInformationToggleComponent,
        AvatarPreviewComponent,
        ProfileEditorComponent,
        ConnectWalletButtonComponent,
        LoopNumberPipe,
        AlertCountdownComponent,
        VaultComponent,
        BattleComponent,
        NftPreviewComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({name: 'dark'}),
    NbLayoutModule,
    NbEvaIconsModule,
    NbButtonModule,
    NbIconModule,
    NbContextMenuModule,
    NbMenuModule.forRoot(),
    NbAlertModule,
    NbToastrModule.forRoot(),
    NgxPaginationModule,
    ReactiveFormsModule,
    NbSpinnerModule,
    NbDialogModule.forRoot(),
    GoogleChartsModule,
    HttpClientModule,
    NgxSkeletonLoaderModule,
    NbListModule,
    NbInputModule,
    NbFormFieldModule,
    SatPopoverModule,
  ],
  providers: [
    // Initialize Moralis
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        return () => {
          return Moralis.start({
            serverUrl: environment.moralis.serverUrl,
            appId: environment.moralis.applicationId
          });
        }
      },
      multi: true
    },
    // Initialize Authentication service
    {
      provide: APP_INITIALIZER,
      deps: [AuthenticationService],
      useFactory: (authenticationService: AuthenticationService) => {
        return () => {
          authenticationService.initialize();
        };
      },
      multi: true,
    },
    // Initialize Token service
    {
      provide: APP_INITIALIZER,
      deps: [TokensService],
      useFactory: (tokensService: TokensService) => {
        return () => {
          tokensService.initialize();
        };
      },
      multi: true,
    },
    // Initialize User Configuration
    {
      provide: APP_INITIALIZER,
      deps: [UserConfigurationService],
      useFactory: (userConfigurationService: UserConfigurationService) => {
        return () => {
          userConfigurationService.initialize();
        };
      },
      multi: true,
    },
    DecimalPipe,
    CurrencyPipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
