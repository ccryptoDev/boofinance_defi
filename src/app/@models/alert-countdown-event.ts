import {Token} from "./token";

export class AlertCountdownEvent {
  startDate: Date;
  endDate?: Date;
  classes: string;
  token: Token;
  buttonColor: string;
}
