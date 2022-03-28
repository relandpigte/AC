import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { EventsServiceProxy, EventDto, PricingType } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less']
})
export class OverviewComponent extends AppComponentBase implements OnInit {
  model = new EventDto();
  eventId: string;
  preview = false;
  likeCount = 0;

  PricingType = PricingType;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _eventsService: EventsServiceProxy,
  ) {
    super(injector);
    route.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('event-id')) {
        this.eventId = paramMap.get('event-id');
        this.getEvent();
      }
    });
  }

  ngOnInit(): void {
  }

  private getEvent(): void {
    this._eventsService.get(this.eventId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.model = response;
      });
  }
}
