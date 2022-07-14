import {Injectable} from '@angular/core';
import {Web3Provider} from "../@enums/web3-provider";
import {BehaviorSubject, from, Observable, of, timer} from "rxjs";
import {Moralis} from "moralis";
import {catchError, concatMap, first, tap} from "rxjs/operators";
import {User} from "../@models/user";
import {NbToastrService} from "@nebular/theme";
import {ErrorHandler} from "../@utils/error-handler";
import {ToastrConfig} from "../@configurations/toastr-config";
declare let window: any;

@Injectable({
  providedIn: 'root'
})

// Requires that the Moralis service had been initialized
export class AuthenticationService {
  userBehaviourSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  constructor(
    private toastrService: NbToastrService,
  ) {}

  initialize() {
    this.userBehaviourSubject.next(AuthenticationService.getUserInstance(Moralis.User.current()));
    timer(500, 1000).subscribe(x => {
      if (window.ethereum) {
        const walletAddress = window.ethereum.selectedAddress;
        if (walletAddress != null && this.userBehaviourSubject.value?.address != null) {
          if (walletAddress != this.userBehaviourSubject.value!.address) {
            this.logout();
            this.toastrService.show('Your wallet has changed, please sign in with your new account.', 'Wallet Disconnected', ToastrConfig.Warning);
          }
        }
      }
    });
  }

  login(provider: Web3Provider = Web3Provider.Metamask): Observable<boolean> {
    switch(provider) {
      case Web3Provider.Metamask:
        // We don't need to manually unsubscribe since we are using a first() pipe
        return from(Moralis.authenticate({
          // @ts-ignore
          signingMessage: 'Authenticate in BooFinance, Gas free!'
        })).pipe(
          first(),
          catchError(err => {
            console.log(err);
            this.toastrService.show(ErrorHandler.getMessage(err), 'Warning', ToastrConfig.Warning);
            return of(null);
          }),
          concatMap((moralisUserInstance: Moralis.User | null) => {
            const user = AuthenticationService.getUserInstance(moralisUserInstance);
            this.userBehaviourSubject.next(user);
            return of(user != null);
          })
        );
      default:
        console.log('Invalid provider');
        return of(false);
    }
  }

  logout(): void {
    // We don't need to manually unsubscribe since we are using a first() pipe
    from(Moralis.User.logOut()).pipe(
      first(),
      // Disconnect Web3 Wallet
      concatMap(() => from(Moralis.cleanup())),
    ).subscribe(() => {
      this.userBehaviourSubject.next(null);
    });
  }

  getConnectedUser(): Observable<User | null> {
    return this.userBehaviourSubject.asObservable();
  }

  updateUserData(userData: Partial<User>): Observable<any | null> {
    if (this.userBehaviourSubject.value) {
      return from(Moralis.Cloud.run('updateUserProfile', {
        nickname: userData.nickname,
        avatar: userData.avatar,
        avatarBackgroundColor: userData.avatarBackgroundColor,
      })).pipe(
        concatMap(() => {
          // Fetch the updated user data
          // @ts-ignore
          return from(Moralis.User.current().fetch());
        }),
        tap((moralisUserInstance: Moralis.User) => {
          // Update the user data within the application
          this.userBehaviourSubject.next(AuthenticationService.getUserInstance(moralisUserInstance));
        })
      );
    } else {
      this.toastrService.show('Your wallet must be connected to perform this operation', 'Wallet Disconnected', ToastrConfig.Warning);
      return of(null);
    }
  }

  private static getUserInstance(moralisUserInstance: Moralis.User | undefined | null): User | null {
    if (moralisUserInstance) {
      return {
        address: moralisUserInstance.get('ethAddress'),
        nickname: moralisUserInstance.get('nickname'),
        createdAt: moralisUserInstance.get('createdAt'),
        updatedAt: moralisUserInstance.get('updatedAt'),
        avatar: moralisUserInstance.get('avatar'),
        avatarBackgroundColor: moralisUserInstance.get('avatarBackgroundColor'),
        moralisUserInstance: moralisUserInstance,
      };
    } else {
      return null;
    }
  }
}
