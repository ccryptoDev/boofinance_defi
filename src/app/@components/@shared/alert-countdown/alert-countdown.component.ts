import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, of, Subscription, timer} from "rxjs";
import {collapseAnimation, fadeInOnEnterAnimation} from "angular-animations";
import {AlertCountdownEvent} from "../../../@models/alert-countdown-event";
import {
  AvaxToken,
  JoeBoofiAvax,
  JoePtpAvax,
  UsdceToken,
} from "../../../../environments/configurations/production-tokens-environment";
import {CauldronService} from "../../../@services/cauldron.service";
import {CauldronTokenDetails} from "../../../@models/cauldron-token-details";
import {catchError, concatMap, distinctUntilChanged, tap, throttleTime} from "rxjs/operators";
import {NbMediaBreakpointsService} from "@nebular/theme";
import {retryForever} from "../../../@utils/rxjs-utils";
import {environment} from "../../../../environments/environment";
import {BoofiStakingDetails} from "../../../@models/boofi-staking-details";
import {StakeService} from "../../../@services/stake.service";
import {CauldronCompositeInterestRate} from "../../../@models/cauldron-composite-interest-rate";
import {aprToApy} from "../../../@utils/number-utils";

@Component({
  selector: 'app-alert-countdown',
  templateUrl: './alert-countdown.component.html',
  styleUrls: ['./alert-countdown.component.scss'],
  animations: [
    collapseAnimation(),
    fadeInOnEnterAnimation({
      duration: 400,
      delay: 120
    }),
  ]
})
export class AlertCountdownComponent implements OnInit, OnDestroy {
  // Constants
  public readonly events: AlertCountdownEvent[] = [
    {
      startDate: new Date(Date.UTC(2022, 1, 1, 19, 0, 0)),
      classes: 'bg-avax-event',
      token: AvaxToken,
      buttonColor: '#D73C3D',
    },
    {
      startDate: new Date(Date.UTC(2022, 1, 3, 19, 0, 0)),
      classes: 'bg-usdce-event',
      token: UsdceToken,
      buttonColor: '#004FC4',
    },
    {
      startDate: new Date(Date.UTC(2022, 1, 4, 19, 0, 0)),
      classes: 'bg-ptp-avax-event',
      token: JoePtpAvax,
      buttonColor: '#32AF78',
    },
    {
      startDate: new Date(Date.UTC(2022, 1, 7, 19, 0, 0)),
      endDate: new Date(Date.UTC(2022, 1, 9, 19, 0, 0)),
      classes: 'bg-boofi-avax-event',
      token: JoeBoofiAvax,
      buttonColor: '#32AF78',
    }
  ];
  // Subscriptions
  private timer$: Subscription;
  private currentEventChanges$: Subscription;
  private currentEventCauldronTokenDetails$: Subscription;
  private boofiStakingDetails$: Subscription;
  // Subscription variables (Variables that are fetched by Subscribing to Observables)
  public displayCountdown: boolean = true;
  public allEventsEnded: boolean = false;
  public secondsUntilInitialStartDate: number | string;
  public minutesUntilInitialStartDate: number | string;
  public hoursUntilInitialStartDate: number | string;
  public daysUntilInitialStartDate: number | string;
  public currentEvent = new BehaviorSubject<AlertCountdownEvent | null>(null);
  public currentEventCauldronTokenDetails: CauldronTokenDetails | null;
  public boofiStakingDetails: BoofiStakingDetails;
  // General
  public aprFontSize: number = 0;

  constructor(
    private cauldronService: CauldronService,
    private nbMediaBreakpointsService: NbMediaBreakpointsService,
    private stakeService: StakeService,
  ) {}

  ngOnInit() {
    this.updateCountdown();
    this.updateAprFontSize();
    this.timer$ = timer(0, 1000).subscribe(x => {
      this.updateCountdown();
    }, error => {
      console.log(error);
    });
    this.currentEventChanges$ = combineLatest([
      this.currentEvent.pipe(
        // Only trigger on distinct event changes
        distinctUntilChanged(),
        // Clear the Cauldron token details on change
        tap(() => {
          this.currentEventCauldronTokenDetails = null;
        })
      ),
      // Refresh the Event Cauldron token details every 5 seconds
      timer(0, 5000),
    ]).pipe(
      throttleTime(2500, undefined, {
        leading: true,
        trailing: true,
      }),
      concatMap(([event, timer]) => {
        if (event) {
          return this.cauldronService.getCauldronTokenDetails(event.token);
        } else {
          return of(null);
        }
      }),
      retryForever(environment.failedRequestsRetryThreshold * 2),
    ).subscribe((tokenDetails) => {
      this.currentEventCauldronTokenDetails = tokenDetails;
    });

    // Retrieves BOOFI Staking APR and refreshes it every 5 seconds
    this.boofiStakingDetails$ = timer(0, 5000).pipe(
      concatMap(() => {
        return this.stakeService.getBoofiStakingDetails();
      }),
      catchError(() => of(null)),
    ).subscribe(boofiStakingDetails => {
      if (boofiStakingDetails) {
        this.boofiStakingDetails = boofiStakingDetails;
      }
    });
  }

  get compositeInterestRate(): CauldronCompositeInterestRate | null {
    if (this.currentEventCauldronTokenDetails?.apr != null && this.boofiStakingDetails?.apr != null) {
      const totalApr = (this.currentEventCauldronTokenDetails.apr / this.boofiStakingDetails.apr) * (Math.pow((1 + (this.boofiStakingDetails.apr / 365)), 365) - 1);
      return {
        tokenApr: this.currentEventCauldronTokenDetails.apr,
        stakeApr: this.boofiStakingDetails.apr,
        compositeApr: totalApr,
        compositeApy: aprToApy(totalApr, 365)
      }
    }
    return null;
  }

  updateCountdown(): void {
    const timeDifference = this.events[0].startDate.getTime() - new Date().getTime();
    // If the first event hasn't started yet
    if (timeDifference > 0) {
      this.secondsUntilInitialStartDate = this.formatDateTime(Math.floor((timeDifference) / (1000) % 60));
      this.minutesUntilInitialStartDate = this.formatDateTime(Math.floor((timeDifference) / (1000 * 60) % 60));
      this.hoursUntilInitialStartDate = this.formatDateTime(Math.floor((timeDifference) / (1000 * 60 * 60) % 24));
      this.daysUntilInitialStartDate = this.formatDateTime(Math.floor((timeDifference) / (1000 * 60 * 60 * 24)));
    } else {
      // If the first event already started
      this.secondsUntilInitialStartDate = '00';
      this.minutesUntilInitialStartDate = '00';
      this.hoursUntilInitialStartDate = '00';
      this.daysUntilInitialStartDate = '00';
      this.currentEvent.next(this.getCurrentEvent());
      // If All events ended close the countdown banner
      if (this.currentEvent.value == null) {
        this.allEventsEnded = true;
        this.displayCountdown = false;
        this.ngOnDestroy();
      }
    }
  }

  getCurrentEvent(): AlertCountdownEvent | null {
    for (let i = 0; i < this.events.length; i++) {
      // Pointers
      const event: AlertCountdownEvent = this.events[i];
      const nextEvent: AlertCountdownEvent | null = this.events[i+1];
      const eventStarted: boolean = (event.startDate.getTime() - new Date().getTime()) <= 0;
      // If there's a next event available use his startDate as this current event endDate, else use this event endDate if available,
      const eventEndDate: Date = nextEvent ? nextEvent.startDate : (event.endDate ? event.endDate : new Date());
      const eventEnded: boolean = eventEndDate.getTime() - new Date().getTime() <= 0;
      if (eventStarted && !eventEnded) {
        return event;
      }
    }
    return null;
  }

  // Listen to Window resize events and update the Chart width accordingly
  @HostListener('window:resize')
  onWindowResize() {
    this.updateAprFontSize();
  }

  get bannerClasses(): string {
    return this.currentEvent?.value?.classes ? this.currentEvent.value!.classes : 'bg-event-vortex';
  }

  updateAprFontSize() {
    const currentBreakPoint: string = this.nbMediaBreakpointsService.getByWidth(window.innerWidth).name;
    switch (currentBreakPoint) {
      case 'xs':
        this.aprFontSize = 2.5;
        break;
      case 'is':
        this.aprFontSize = 3;
        break;
      case 'sm':
        this.aprFontSize = 3;
        break;
      case 'md':
        this.aprFontSize = 3.5;
        break;
      case 'lg':
        this.aprFontSize = 4;
        break;
      default:
        this.aprFontSize = 4;
        break;
    }
  }

  /**
    Opens a new window with the event article
  **/
  openArticle() {
    window.open('https://medium.com/@boofinance2021/introducing-the-boofi-mania-9a8bce558b90', '_blank');
  }

  /**
    Appends a zero at the start of the value if it has less than 1 digit
  **/
  formatDateTime(value: number): number | string {
    if (value < 10) {
      return '0' + value;
    }
    return value;
  }

  ngOnDestroy() {
    this.timer$?.unsubscribe();
    this.currentEventCauldronTokenDetails$?.unsubscribe();
    this.currentEventChanges$?.unsubscribe();
    this.boofiStakingDetails$?.unsubscribe();
  }

}
