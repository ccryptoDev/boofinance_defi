import {Component, Input, OnChanges, OnInit, EventEmitter, SimpleChanges, Output} from '@angular/core';
import {Nft} from '../../../@models/nft'

@Component({
  selector: 'app-nft-preview',
  templateUrl: './nft-preview.component.html',
  styleUrls: ['./nft-preview.component.scss']
})
export class NftPreviewComponent implements OnInit {
  @Output() onBuyToken = new EventEmitter<Number>();
  @Input() token?: Nft;
  @Input() nameColor?: String;
  @Input() userNft: Boolean;

  ngOnInit(): void {
  }

  buyToken(tokenId: Number): void {
    this.onBuyToken.emit(tokenId)
  }
}
