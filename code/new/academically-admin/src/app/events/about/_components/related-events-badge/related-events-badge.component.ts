import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Injector } from '@node_modules/@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { EventDto, EventsServiceProxy } from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

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
  get userId(): number { return this.appSession.userId; }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes && !!this.data) {
      this.initRelatedEvents();
    }
  }

  handleItemClick(item: any, type: string): void {
    switch (type) {
      case 'events':
        this._router.navigate(['app/events', item.id, 'about']);
        break;
      default:
    }
  }

  private initRelatedEvents(): void {
    this._eventsService.getAll(undefined, this.userId, undefined, undefined, undefined, undefined, undefined, undefined, 4)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(events => {
        this.relatedEvents = events.items;
        console.warn(events);
      });
  }
}
