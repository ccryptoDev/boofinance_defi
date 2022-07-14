import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {BattleTokenSelectionMenu, BattleMintProcessMenu} from "../../@enums/battle-enum-menu";
import {combineLatest, Observable, of, Subscription, timer} from "rxjs";
import {AccountService} from "../../@services/account.service";
import {NftService} from "../../@services/nft.service";
import {Token} from "../../@models/token";
import {Nft} from "../../@models/nft"
import {
  concatMap,
  filter,
  first
} from "rxjs/operators";
import {NbMenuService, NbToastrService} from "@nebular/theme";
import {ToastrConfig} from "../../@configurations/toastr-config";
import {PaginationInstance} from "ngx-pagination";
import {collapseAnimation, fadeInOnEnterAnimation} from "angular-animations";
import {AuthenticationService} from "../../@services/authentication.service";
import {User} from "../../@models/user";
import {UserConfigurationService} from "../../@services/user-configuration.service";
import {UserConfiguration} from "../../@models/user-configuration";
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
  styles: [':host { display: block }'],
  animations: [
    fadeInOnEnterAnimation({
      duration: 400,
      delay: 120
    }),
    fadeInOnEnterAnimation({
      anchor: 'enter',
      duration: 750
    }),
    collapseAnimation()
  ],
})
export class BattleComponent implements OnInit, OnDestroy {
  @HostBinding('@enter')
  // Subscriptions
  userTokens$: Subscription;
  newTokens$: Subscription;
  selectedTokenUserDetails$: Subscription;
  user$: Subscription;
  userConfiguration$: Subscription;
  // Subscription variables (Variables that are fetched by Subscribing to Observables)
  userTokens: Map<Number, Nft> | null;
  newTokens: Map<Number, Nft> | null;
  user: User | null;
  userConfiguration: UserConfiguration;
  selectedToken: Token | null;
  // Loading booleans
  loadingUserTokens: boolean = true;
  loadingNewTokens: boolean = true;
  // Progress booleans
  progressingMint: boolean = false;
  delayAfterMint: boolean = false;
  progressingUnlock: boolean = false;
  // Enums
  BattleTokenSelectionMenuEnum = BattleTokenSelectionMenu;
  BattleMintProcessMenuEnum = BattleMintProcessMenu;
  // Menu variables
  newTokensCurrentPage: number = 1;

  // NFT variables
  totalSupply: number = 0;
  nftCost: number = 0;
  statistic1: number = 0;
  statistic2: number = 0;
  statistic3: number = 0;
  rank: number = 0;
  // Flag that specifies if the user changed the token selection menu at least once
  userUpdatedBattleSelectionMenu: boolean = false;
  battleTokenSelectionMenu: BattleTokenSelectionMenu = BattleTokenSelectionMenu.Param1;
  battleMintProcessMenu: BattleMintProcessMenu = BattleMintProcessMenu.Mint;
  Number = Number;

  constructor(
    private authenticationService: AuthenticationService,
    private accountService: AccountService,
    private nftService: NftService,
    private nbMenuService: NbMenuService,
    private toastrService: NbToastrService,
    private userConfigurationService: UserConfigurationService
  ) { }

  ngOnInit(): void {
    // Retrieve the connected user
    this.user$ = this.authenticationService.getConnectedUser().subscribe(user => {
      this.user = user;
      // Clear the user tokens
      this.userTokens = null;
      this.newTokens = null;
      // If the user is connected get user NFTs and new ones
      if (this.user) {
        this.loadingUserTokens = true;
        this.loadingNewTokens = true;
        // Get the user NFTs and new ones
        this.getTokens();
      } else {
        this.loadingUserTokens = false;
        this.loadingNewTokens = false;
      }
    });

    this.userConfiguration$ = this.userConfigurationService.getUserConfiguration().subscribe(configuration => {
      this.userConfiguration = configuration;
    });
  }

  /**
    Observes the connected user and if it performs any transaction
  **/
  onUserConnectedAndExecutesTransaction(): Observable<[User | null, any]> {
    return this.authenticationService.getConnectedUser().pipe(
      filter(user => user != null),
      concatMap((user) => {
        return combineLatest([
          of(user),
          this.accountService.onUserExecutesTransaction(user!.address),
        ])
      }),
    );
  }

  /**
    Subscribes to the connected user tokens (The ones available on their wallets)
  **/
  getTokens() {
    this.userTokens$?.unsubscribe();
    this.userTokens$ = this.onUserConnectedAndExecutesTransaction().pipe(
      concatMap(([user, transaction]) => {
        return combineLatest([
          this.nftService.getUserNftTokens(),
          this.nftService.getNewNftTokens(),
          /* A service to bring totalSupply of user */
          this.accountService.getUserTokenBalances(user!.address),
        ]);
      })
    ).subscribe(([userNfts, newNfts, tokenBalances]) => {
      let userTokens = new Map<Number, Nft>();
      let newTokens = new Map<Number, Nft>();
      
      this.totalSupply = 2456;
      this.nftCost = 1125;

      userNfts.forEach(token => {
        userTokens.set(token.tokenId, token);
      });
      newNfts.forEach(token => {
        newTokens.set(token.tokenId, token);
      });
      this.loadingUserTokens = false;
      this.loadingNewTokens = false;
      this.userTokens = userTokens;
      this.newTokens = newTokens;
      console.log('user tokens: ', userTokens);
      console.log('new tokens: ', newTokens);
    }, error => {
      console.log('failed to load user tokens', error);
      this.loadingUserTokens = false;
      this.loadingNewTokens = false;
    });
  }

  /**
    Returns the pagination configuration for ngx-pagination
    @return paginationInstance
  **/
  paginationConfig(instanceId: string, currentPage: number): PaginationInstance {
    return {
      id: instanceId,
      itemsPerPage: window.innerWidth >= 1200 ? 8 : 8,
      currentPage: currentPage,
    }
  }

  /**
    Toggle the Information card help and save his status on the user configuration
  **/
  onHelpToggled(): void {
    const newConfiguration = this.userConfiguration;
    newConfiguration.helpToggles.howToUseBattle = !newConfiguration.helpToggles.howToUseBattle;
    this.userConfigurationService.setUserConfiguration(newConfiguration);
  }

  /**
    Updates the active "Select a token" tab
    @param battleTokenSelectionMenu The Enum index which the Tab we want to display
  **/
  setTokenSelectionTab(battleTokenSelectionMenu: BattleTokenSelectionMenu): void {
    this.userUpdatedBattleSelectionMenu = true;
    this.battleTokenSelectionMenu = battleTokenSelectionMenu;
  }

  /** 
    Buy new nft
    @param tokenId ID of new token to buy
  **/
  onBuyToken(tokenId: Number) {
    console.log(tokenId);
    this.toastrService.show('Minted successfully!', 'Success', ToastrConfig.Success);
  }

  /**
    Mint new nft 
  **/
  onMint(): void {
    // set a spinner flag
    this.progressingMint = true;
    const delayAction$ = timer(3000)
    delayAction$.subscribe(delay => {
      this.toastrService.show('Minted successfully!', 'Success', ToastrConfig.Success);
      this.progressingMint = false;
      this.delayAfterMint = true;
      this.battleMintProcessMenu = BattleMintProcessMenu.DelayingAfterMint;
      this.onDelayAfterMint(3000);
    });
  }

  /**
    Perferm the delay after minting 
  **/
  onDelayAfterMint(delay: number) {
    const delayAction$ = timer(delay)
    delayAction$.subscribe(delay => {
      this.delayAfterMint = true;
      // use dummy data for now
      this.statistic1 = 1236;
      this.statistic2 = 3258;
      this.statistic3 = 562;
      this.rank = 40;
      this.battleMintProcessMenu = BattleMintProcessMenu.Unlock;
    })
  }

  /**
    Perferm the unlocking
  **/
  onUnlock(): void {
    this.progressingUnlock = true;
    const delayAction$ = timer(3000)
    delayAction$.subscribe(delay => {
      this.toastrService.show('Unlocked successfully!', 'Success', ToastrConfig.Success);
      this.progressingUnlock = false;
    })
  }

  /**
    Unsubscribe from any active subscriptions to avoid memory leaks
  **/
  ngOnDestroy(): void {
    this.userTokens$?.unsubscribe();
    this.userConfiguration$?.unsubscribe();
    this.accountService.unsubscribeFromLiveQueries();
  }
  
}
