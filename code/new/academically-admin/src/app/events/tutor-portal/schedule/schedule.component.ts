import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.less']
})
export class ScheduleComponent extends AppComponentBase implements OnInit {
  eventId: string;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
  ) {
    super(injector);
    route.parent.parent.paramMap
      .pipe(takeUntil(this.destroyed$))
      .subscribe(paramMap => {
        if (paramMap.has('id')) {
          this.eventId = paramMap.get('id');
        }
      });
  }

  ngOnInit(): void {
  }

}
