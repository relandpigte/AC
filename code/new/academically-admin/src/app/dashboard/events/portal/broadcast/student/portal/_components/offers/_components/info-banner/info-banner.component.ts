import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  selector: 'app-info-banner',
  templateUrl: './info-banner.component.html',
  styleUrls: ['./info-banner.component.less']
})
export class InfoBannerComponent extends AppComponentBase implements OnInit {
  @Input() endTime: Moment;
  @Input() availableUnits: number;
  @Input() numberOfSales: number;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {

  }

}
