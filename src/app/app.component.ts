import {Component, OnInit} from '@angular/core';
import {NbIconLibraries, NbMenuItem, NbMenuService, NbToastrService} from "@nebular/theme";
import {BooFinanceIcons} from "./@utils/boo-finance-icons";
import {TokensService} from "./@services/tokens.service";
import {AuthenticationService} from "./@services/authentication.service";
import {User} from "./@models/user";
import {ToastrConfig} from "./@configurations/toastr-config";
import {MarketSizeService} from "./@services/market-size.service";
import {timer} from "rxjs";
import {concatMap, first} from "rxjs/operators";
import {MarketSize} from "./@models/market-size";
import {fadeInOnEnterAnimation} from "angular-animations";
import {environment} from "../environments/environment";
import {TokenPriceService} from "./@services/token-price.service";
import {BoofiToken, ZBoofiToken} from "../environments/configurations/production-tokens-environment";
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fadeInOnEnterAnimation({
      duration: 400,
      delay: 120
    }),
  ]
})
export class AppComponent implements OnInit {
  version: string = environment.version;
  production: boolean = environment.production;
  // Subscription variables (Variables that are fetched by Subscribing to Observables)
  user: User | null;
  marketSize: MarketSize;
  boofiPriceInUsd: number | null;
  // Menu variables
  loadingWalletConnection: boolean;
  headerMenuItems: NbMenuItem[] = [
    {
      title: 'Home',
      link: '/home'
    },
    {
      title: 'Vault',
      link: '/vault'
    },
    {
      title: 'Cauldron',
      link: '/cauldron'
    },
    {
      title: 'Stake',
      link: '/stake'
    },
    {
      title: 'Battle',
      link: '/battle'
    },
    {
      title: 'Well of Souls',
      link: '/well-of-souls'
    },
    {
      title: 'Docs',
      url: 'https://boofinance.gitbook.io/boo-finance/'
    },
  ];
  connectWalletMenu: NbMenuItem = {
    title: 'Connect Wallet',
    data: {
      action: 'connect',
      type: 'wallet'
    }
  };
  disconnectWalletMenu: NbMenuItem = {
    title: 'Disconnect wallet',
    data: {
      action: 'disconnect',
      type: 'wallet'
    }
  };
  updateProfileMenu: NbMenuItem = {
    title: 'Edit Profile',
    link: '/profile'
  };
  boofiHeaderMenuItems: NbMenuItem[] = [
    {
      title: 'Buy BOOFI on Trader Joe',
      url: 'https://traderjoexyz.com/trade?outputCurrency=0xb00f1ad977a949a3ccc389ca1d1282a2946963b0',
      target: '_blank'
    },
    {
      title: 'Buy BOOFI on Pangolin',
      url: 'https://app.pangolin.exchange/#/swap?outputCurrency=0xb00f1ad977a949a3ccc389ca1d1282a2946963b0',
      target: '_blank'
    },
    {
      title: 'Buy BOOFI on Lydia',
      url: 'https://exchange.lydia.finance/#/swap?outputCurrency=0xb00f1ad977a949a3ccc389ca1d1282a2946963b0',
      target: '_blank'
    },
    {
      title: 'Add BOOFI to Wallet',
      data: {
        action: 'add-boofi',
        type: 'wallet'
      }
    },
    {
      title: 'Add zBOOFI to Wallet',
      data: {
        action: 'add-zboofi',
        type: 'wallet'
      }
    }
  ];

  // ------------------ Variable declarations ends ------------------
  constructor(
    private iconLibraries: NbIconLibraries,
    private tokensService: TokensService,
    private authenticationService: AuthenticationService,
    private nbMenuService: NbMenuService,
    private toastrService: NbToastrService,
    private marketSizeService: MarketSizeService,
    private tokenPriceService: TokenPriceService,
    private currencyPipe: CurrencyPipe
  ) {
    this.iconLibraries.registerSvgPack('boofi', BooFinanceIcons);
  }

  ngOnInit(): void {
    // Subscribe to the current connected user
    this.authenticationService.getConnectedUser().subscribe(user => {
      this.user = user;
    });
    // Subscribe to menus interaction
    this.nbMenuService.onItemClick().subscribe(menuBag => {
      // Handle Wallet Connection and Disconnection menus
      if (menuBag.item?.data?.type == 'wallet') {
        switch (menuBag.item.data.action) {
          case 'connect':
            this.connectWallet();
            break;
          case 'disconnect':
            this.authenticationService.logout();
            break;
          case 'add-boofi':
            this.addBoofiToWallet();
            break;
          case 'add-zboofi':
            this.addZboofiToWallet();
            break;
        }
      }
    });
    // Retrieves and refreshes the Market Size every 1 minutes
    timer(0, 60000).pipe(
      concatMap(() => this.marketSizeService.getLatestMarketSize())
    ).subscribe(marketSize => {
      this.marketSize = marketSize;
    });
    // Retrieves and refreshes BOOFI price every 2 minutes
    timer(0, 120000).pipe(
      concatMap(() => this.tokenPriceService.getTokenPriceInUsd(BoofiToken))
    ).subscribe(boofiPriceInUsd => {
      this.boofiPriceInUsd = boofiPriceInUsd;
    });
  }

  connectWallet() {
    if (!this.loadingWalletConnection) {
      this.loadingWalletConnection = true;
      // We don't need to manually unsubscribe since login() uses a first() pipe
      this.authenticationService.login().subscribe(connectionSucceeded => {
        if (connectionSucceeded) {
          this.toastrService.show('Wallet connected successfully', 'Success', ToastrConfig.Success);
        }
        this.loadingWalletConnection = false;
      });
    }
  }

  get boofiTickerTitle(): string {
    let title: string = 'BOOFI';
    let price = null;
    if (this.boofiPriceInUsd) {
      price = this.currencyPipe.transform(this.boofiPriceInUsd, 'USD', 'symbol', '1.0-2');
    }
    return price ? price : title;
  }

  addBoofiToWallet() {
    this.tokensService.addTokenToWallet(BoofiToken).pipe(first()).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  addZboofiToWallet() {
    this.tokensService.addTokenToWallet(ZBoofiToken).pipe(first()).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }
}
