import {Component, Input, OnInit} from '@angular/core';
import {BoofiStakingDetails} from "../../../@models/boofi-staking-details";
import {fadeInOnEnterAnimation} from "angular-animations";

@Component({
  selector: 'app-stake-exchange-rate',
  templateUrl: './stake-exchange-rate.component.html',
  animations: [
    fadeInOnEnterAnimation({
      duration: 400,
      delay: 120
    }),
  ]
})
export class StakeExchangeRateComponent implements OnInit {
  @Input() boofiStakingDetails: BoofiStakingDetails | null;
  mode: 'zBOOFI->BOOFI' | 'BOOFI->zBOOFI' = 'BOOFI->zBOOFI';

  constructor() {
  }

  ngOnInit(): void {
  }

}
