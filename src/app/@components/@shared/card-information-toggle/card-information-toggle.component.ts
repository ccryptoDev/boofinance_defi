import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {collapseAnimation, fadeInOnEnterAnimation} from "angular-animations";

@Component({
  selector: 'app-card-information-toggle',
  templateUrl: './card-information-toggle.component.html',
  styleUrls: ['./card-information-toggle.component.scss'],
  animations: [
    collapseAnimation(),
    fadeInOnEnterAnimation({
      duration: 400,
      delay: 120
    }),
  ]
})
export class CardInformationToggleComponent implements OnInit {
  @Output() onHelpToggled = new EventEmitter<boolean>();
  @Input() displayHelp: boolean | undefined = false;
  @Input() bodyClasses: string = 'bg-shamrock';
  @Input() bodyTitle: string = '';
  @Input() bodyDescription: string = '';
  @Input() bodyImageUrl: string;
  @Input() bodyImageMaxHeight: number = 180;
  @Input() toggleHelpTitle: string = '';
  @Input() learnMoreUrl: string | undefined | null = null;
  @Input() customActionTitle: string | undefined | null = null;
  @Input() customActionIcon: string | undefined | null = null;
  @Output() onCustomAction = new EventEmitter<boolean>();
  // If the Help was toggled since this component was created
  helpWasToggled: boolean = false;
  @Input() coveredBodyImage: string | undefined = '';
  constructor() {}

  ngOnInit(): void {
  }

  toggleHelp(): void {
    this.helpWasToggled = true;
    this.onHelpToggled.emit(true);
  }

  customActionClicked(): void {
    this.onCustomAction.emit(true);
  }

  openLearnMore() {
    if (this.learnMoreUrl) {
      window.open(this.learnMoreUrl, '_blank');
    }
  }

}
