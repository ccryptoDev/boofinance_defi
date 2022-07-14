import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Token} from "../../../@models/token";

@Component({
  selector: 'app-token-preview',
  templateUrl: './token-preview.component.html',
  styleUrls: ['./token-preview.component.scss']
})
export class TokenPreviewComponent implements OnInit, OnChanges {
  @Input() token?: Token;
  @Input() selected: boolean = false;
  @Input() displayTokenSymbolOrLPSource: boolean = true;
  @Input() displayStakedDecorator: boolean | null | undefined = false;
  tokenLogoError: boolean = false;
  lpTokenLogoError: boolean = false;

  ngOnInit(): void {}

  get tokenGlowColor(): string {
    return (this.token?.glowColor ? this.token.glowColor : '#AFFFAB');
  }

  ngOnChanges(changes: SimpleChanges) {
    // If the token changed, Allow it to load his images again.
    if (changes.token?.previousValue?.address != changes.token?.currentValue?.address) {
      this.tokenLogoError = false;
      this.lpTokenLogoError = false;
    }
  }

}
