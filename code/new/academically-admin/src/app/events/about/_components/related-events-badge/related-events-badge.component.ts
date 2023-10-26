import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { EventDto, EventsServiceProxy, EventStatus } from '@shared/service-proxies/service-proxies';


@Component({
  selector: 'app-related-events-badge',
  templateUrl: './related-events-badge.component.html',
  styleUrls: ['./related-events-badge.component.less']
})
export class RelatedEventsBadgeComponent extends AppComponentBase implements OnInit, OnChanges {
  relatedEvents: any[] = Array(4).fill([]).map(() => this.generateRandomEvent()) as any[];
  shimmerType = ShimmerType;

  @Input() data: EventDto;

  constructor(
    injector: Injector,
    private _router: Router,
    private _landingPageService: LandingPagesService,
    private _eventsService: EventsServiceProxy
  ) {
    super(injector);
  }

  get isLoading$() { return this._landingPageService.isLoading$; }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes && !!this.data) {
      this.initRelatedEvents();
    }
  }

  dateComposition(event: EventDto): string {
    const { eventDateTime, duration} = event;
    return `FROM ${moment(eventDateTime).format('HH:mm')}-${moment(eventDateTime).add(duration, 'minutes').format('HH:mm')}, ${moment(eventDateTime).format('DD ddd, YYYY')}`;
  }

  async handleItemClick(item: any): Promise<void> {
    await this._router.navigate(['app/events', item.id, 'about']);
  }

  private initRelatedEvents(): void {
    this._eventsService.getAll(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      EventStatus.Published,
      undefined,
      undefined,
      undefined
    )
      .pipe(takeUntil(this.destroyed$))
      .subscribe(events => {
        this.relatedEvents = _.take(events.items.filter(x => x.id !== this.data?.id), 4);
      });
  }
}
