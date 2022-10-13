import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import * as moment from 'moment';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.less']
})
export class QueueComponent extends AppComponentBase implements OnInit {
  offers: any[] = [
    {
      name: 'Queued Offer 1',
      size: 232.42,
      sizeUnit: 'Kb',
      type: 'PNG',
      shared: moment()
    },
    {
      name: 'Queued Offer 2',
      size: 2456.21,
      sizeUnit: 'MB',
      type: 'MOV',
      shared: moment()
    },
    {
      name: 'Queued Offer 3',
      size: 2456.21,
      sizeUnit: 'MB',
      type: 'MOV',
      shared: moment()
    },
    {
      name: 'Queued Offer 4',
      size: 2456.21,
      sizeUnit: 'MB',
      type: 'MOV',
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
