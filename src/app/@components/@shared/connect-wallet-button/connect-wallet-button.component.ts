import {Component, Input, OnInit} from '@angular/core';
import {ToastrConfig} from "../../../@configurations/toastr-config";
import {AuthenticationService} from "../../../@services/authentication.service";
import {NbToastrService} from "@nebular/theme";
import {NbComponentSize} from "@nebular/theme/components/component-size";
import {NbComponentOrCustomStatus} from "@nebular/theme/components/component-status";

@Component({
  selector: 'app-connect-wallet-button',
  templateUrl: './connect-wallet-button.component.html',
  styleUrls: ['./connect-wallet-button.component.scss']
})
export class ConnectWalletButtonComponent implements OnInit {
  @Input() size: NbComponentSize = 'medium';
  @Input() status: NbComponentOrCustomStatus = 'basic';
  @Input() classes: string = '';
  @Input() message: string = 'Connect Wallet';
  @Input() fullWidth: boolean = false;
  loadingWalletConnection: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private toastrService: NbToastrService,
  ) {
  }

  ngOnInit(): void {
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

}
