import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import * as moment from 'moment';

@Component({
  selector: 'app-closed',
  templateUrl: './closed.component.html',
  styleUrls: ['./closed.component.less']
})
export class ClosedComponent extends AppComponentBase implements OnInit {
  offers: any[] = [
    {
      name: 'Closed Offer',
      size: 521.42,
      sizeUnit: 'MB',
      type: 'WAV',
      shared: moment()
    }
  ];

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {

  }

}
