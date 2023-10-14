import { Component, Input, OnInit } from '@angular/core';
import { Injector } from '@node_modules/@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { EventDto } from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';

@Component({
  selector: 'app-related-events-badge',
  templateUrl: './related-events-badge.component.html',
  styleUrls: ['./related-events-badge.component.less']
})
export class RelatedEventsBadgeComponent extends AppComponentBase implements OnInit {
  relatedEvents: any[] = Array(4).fill([]).map(() => this.generateRandomEvent()) as any[];
  shimmerType = ShimmerType;

  @Input() data: EventDto;

  constructor(
    injector: Injector,
    private _router: Router,
    private _landingPageService: LandingPagesService
  ) {
    super(injector);
  }

  get isLoading$() { return this._landingPageService.isLoading$; }

  ngOnInit(): void {
  }

  handleItemClick(item: any, type: string): void {
    switch (type) {
      case 'events':
        this._router.navigate(['app/events', item.id, 'about']);
        break;
      default:
    }
  }

}
