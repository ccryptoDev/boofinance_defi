import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {UserConfiguration} from "../@models/user-configuration";

@Injectable({
  providedIn: 'root'
})
export class UserConfigurationService {
  readonly defaultUserConfiguration: UserConfiguration = {
    helpToggles: {
      howToStakeBoofi: true,
      howToUseBooFinance: true,
      howToUseCauldron: true,
      howToUseWellOfSouls: true,
      howToUseVault: true,
      howToUseBattle: true,
    }
  }
  userConfiguration: BehaviorSubject<UserConfiguration>;

  constructor() { }

  initialize() {
    this.loadUserConfiguration();
  }

  getUserConfiguration(): Observable<UserConfiguration> {
    this.loadUserConfiguration();
    return this.userConfiguration.asObservable();
  }

  setUserConfiguration(newConfiguration: UserConfiguration) {
    localStorage.setItem('user_configuration', JSON.stringify(newConfiguration));
    this.userConfiguration.next(newConfiguration);
  }

  setDefaultConfiguration() {
    this.userConfiguration = new BehaviorSubject<UserConfiguration>(this.defaultUserConfiguration);
  }

  private loadUserConfiguration() {
    if(localStorage.getItem('user_configuration') != null) {
      try {
        let configuration: UserConfiguration = JSON.parse(<string>localStorage.getItem('user_configuration'));
        this.userConfiguration.next(configuration);
      } catch (e) {
        this.setDefaultConfiguration();
      }
    } else {
      this.setDefaultConfiguration();
    }
  }
}
