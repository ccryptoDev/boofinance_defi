import {Component, HostBinding, OnInit} from '@angular/core';
import {fadeInOnEnterAnimation} from "angular-animations";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  styles: [':host { display: block }'],
  animations: [
    fadeInOnEnterAnimation({anchor: 'enter', duration: 750}),
  ]
})
export class HomeComponent implements OnInit {
  // @ts-ignore
  @HostBinding('@enter')
  constructor() { }
  ngOnInit(): void {
  }

  scrollToElement(element: any): void {
    element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
}
