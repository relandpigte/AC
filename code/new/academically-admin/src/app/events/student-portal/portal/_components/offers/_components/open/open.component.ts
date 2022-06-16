import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import * as moment from 'moment';

@Component({
  selector: 'app-open',
  templateUrl: './open.component.html',
  styleUrls: ['./open.component.less']
})
export class OpenComponent extends AppComponentBase implements OnInit {
  offers: any[] = [
    {
      name: 'Open Offer',
      size: 232.42,
      sizeUnit: 'Kb',
      type: 'PNG',
      shared: moment()
    }
  ];

  launched: boolean = false;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {

  }

}
