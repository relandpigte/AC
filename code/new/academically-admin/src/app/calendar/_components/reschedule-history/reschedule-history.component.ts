import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { RescheduleCommentDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-reschedule-history',
  templateUrl: './reschedule-history.component.html',
  styleUrls: ['./reschedule-history.component.less']
})
export class RescheduleHistoryComponent extends AppComponentBase implements OnInit {
  @Input() rescheduleComments: RescheduleCommentDto[] = [];

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
