import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ChartType} from "angular-google-charts";
import {NbDialogRef, NbMediaBreakpointsService} from "@nebular/theme";
import {fadeInOnEnterAnimation} from "angular-animations";
import {TokensService} from "../../../@services/tokens.service";
import {Subscription} from "rxjs";
import {Token} from "../../../@models/token";
import {NbMediaBreakpoint} from "@nebular/theme/services/breakpoints.service";
import {CauldronService} from "../../../@services/cauldron.service";
import {CauldronTokenDetails} from "../../../@models/cauldron-token-details";
import {CauldronComposition} from "../../../@models/cauldron-composition";

@Component({
  selector: 'app-cauldron-composition',
  templateUrl: './cauldron-composition.component.html',
  styleUrls: ['./cauldron-composition.component.scss'],
  animations: [
    fadeInOnEnterAnimation({
      anchor: 'enter',
      duration: 350
    }),
    fadeInOnEnterAnimation({
      duration: 400,
      delay: 120
    }),
  ]
})
export class CauldronCompositionComponent implements OnInit, OnDestroy {
  // Subscriptions
  tokens$: Subscription;
  cauldronComposition$: Subscription;
  // Subscription variables
  tokens: Map<string, Token>;
  // Menu variables
  breakPoints: NbMediaBreakpoint[];
  chartType = ChartType.PieChart;
  cauldronComposition: CauldronComposition | null;
  currentPage: number = 1;
  chartWidth: number;
  chartOptions = {
    pieHole: 0.35,
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'selection'
    },
    // enableInteractivity: false,
    legend: {
      position: 'none',
    },
    chartArea: {
      width: '55%',
      height: '55%'
    },
    colors: [
      '#163120',
      '#1D402A',
      '#46b477',
      '#3d9a66',
      '#327D52',
      '#2E6D43',
      '#4E7C43',
      '#7AA942',
      '#d7ff63',
      '#acd239',
      '#a0c924',
      '#85a725',
      '#698d02',
      '#4f6a02',
      '#344501',
      '#5fbb67',
      '#76f681',
      '#8efc97',
      '#b1ffb2',
    ]
  };
  chartData: any = null;
  constructor(
    private dialogRef: NbDialogRef<any>,
    private tokensService: TokensService,
    private cauldronService: CauldronService,
    private nbMediaBreakpointsService: NbMediaBreakpointsService,
  ) {}

  ngOnInit(): void {
    this.chartResize();
    this.tokens$ = this.tokensService.getLPTokens().subscribe((tokens) => {
      this.tokens = tokens;
    });
    this.getCauldronComposition();
  }

  reloadChartData(cauldronTokensDetailsMap: Map<string, CauldronTokenDetails>) {
    let chartData: any[] = [];
    let chartColors: string[] = [];
    let i = 1;
    cauldronTokensDetailsMap.forEach((cauldronTokenDetails) => {
      const token = this.tokens.get(cauldronTokenDetails.tokenAddress!.toLowerCase());
      let chartElementLabel: string;
      let chartBackgroundColor: string;
      if (token) {
        chartElementLabel = (i).toString() + ' - ' + token.symbol;
        chartBackgroundColor = token.compositionChartBackgroundColor;
      } else {
        chartElementLabel = (i).toString();
        chartBackgroundColor = '#ffffff';
      }
      chartData.push([chartElementLabel, cauldronTokenDetails.liquidityInUsd]);
      chartColors.push(chartBackgroundColor);
      i += 1;
    });
    this.chartData = chartData;
    this.chartOptions.colors = chartColors;
  }

  // Listen to Window resize events and update the Chart width accordingly
  @HostListener('window:resize')
  chartResize() {
    const currentBreakPoint: NbMediaBreakpoint = this.nbMediaBreakpointsService.getByWidth(window.innerWidth);
    this.chartWidth = this.getChartSize(currentBreakPoint.name);
  }

  getCurrentChartSize(): number {
    const currentBreakPoint: NbMediaBreakpoint = this.nbMediaBreakpointsService.getByWidth(window.innerWidth);
    return this.getChartSize(currentBreakPoint.name);
  }

  getChartSize(breakpointName: string) {
    switch (breakpointName) {
      case 'xs':
        return 230;
      case 'is':
        return 300;
      case 'sm':
        return 360;
      case 'md':
        return 400;
      case 'lg':
        return 440;
      default:
        return  500;
    }
  }

  getCauldronComposition() {
    this.cauldronComposition$?.unsubscribe();
    this.cauldronComposition$ = this.cauldronService.getCauldronComposition(false, this.tokens).subscribe(cauldronComposition => {
      if (cauldronComposition) {
        this.reloadChartData(cauldronComposition.tokensDetailsMap);
        this.cauldronComposition = cauldronComposition;
      }
    });
  }

  // Close the current dialog
  close() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    // Unsubscribe from subscriptions to avoid memory leaks
    this.tokens$?.unsubscribe();
    this.cauldronComposition$?.unsubscribe();
  }

}
