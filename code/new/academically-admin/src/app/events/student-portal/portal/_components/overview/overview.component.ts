import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { EventsServiceProxy, EventDto, PricingType, UserFollowersServiceProxy, UserFollowerDto, StudentEventDto } from '@shared/service-proxies/service-proxies';
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
  userFollower: UserFollowerDto;
  parentStudentEvent: StudentEventDto;

  PricingType = PricingType;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _eventsService: EventsServiceProxy,
    private _userFollowersService: UserFollowersServiceProxy,
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

  onFollowClick(): void {
    this._userFollowersService.create(this.model.creatorUser.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.userFollower = response;
        this.notify.success(this.l('YouAreNowFollowingThisUser'));
      });
  }

  onUnfollowClick(): void {
    this._userFollowersService.delete(this.userFollower.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.userFollower = undefined;
        this.notify.success(this.l('YouUnfollowedThisUser'));
      });
  }

  private getEvent(): void {
    this._eventsService.get(this.eventId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.model = response;
        this.getUserFollower();
        this.getStudentEvent();
      });
  }

  private getUserFollower(): void {
    this._userFollowersService.get(this.model.creatorUser.id, this.appSession.userId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.userFollower = response;
      });
  }

  private getStudentEvent(): void {
    if (this.model.parent && this.model.parent.id) {
      this._eventsService.getPurchased(this.model.parentId)
        .subscribe(response => {
          this.parentStudentEvent = response;
        });
    }
  }
}
