import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  EventsServiceProxy,
  EventDto,
  PricingType,
  UserFollowersServiceProxy,
  UserFollowerDto,
  StudentEventDto,
  ReactionsServiceProxy,
  ReactionType,
} from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

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
  isLiked = false;
  userFollower: UserFollowerDto;
  parentStudentEvent: StudentEventDto;
  studentEvent: StudentEventDto;

  PricingType = PricingType;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _eventsService: EventsServiceProxy,
    private _userFollowersService: UserFollowersServiceProxy,
    private _reactionsService: ReactionsServiceProxy,
  ) {
    super(injector);
    route.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('event-id')) {
        this.eventId = paramMap.get('event-id');
        this.getEvent();
        this.getStudentEvent();
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

  onSaveClick(): void {
    const newStudentEvent = new StudentEventDto();
    newStudentEvent.eventId = this.model.id;
    newStudentEvent.saveOnly = true;
    this._eventsService.purchase(newStudentEvent)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.getStudentEvent();
      });
  }

  onUnsaveClick(): void {
    this._eventsService.unsave(this.studentEvent.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.notify.success(this.l('UnsavedSuccessfully'));
        this.getStudentEvent();
      });
  }

  onLikeClick(): void {
    this._reactionsService.save(this.model.id, ReactionType.Like)
      .subscribe(() => {
        if (this.isLiked) {
          this.isLiked = false;
          this.likeCount--;
        } else {
          this.isLiked = true;
          this.likeCount++;
        }
      });
  }

  private getEvent(): void {
    this._eventsService.get(this.eventId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.model = response;
        this.getUserFollower();
        this.getParentStudentEvent();
        this.getLike();
        this.getLikeCount();
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
    this._eventsService.getPurchased(this.eventId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.studentEvent = response;
      });
  }

  private getParentStudentEvent(): void {
    if (this.model.parent && this.model.parent.id) {
      this._eventsService.getPurchased(this.model.parentId)
        .subscribe(response => {
          this.parentStudentEvent = response;
        });
    }
  }

  private getLike(): void {
    this._reactionsService.get(this.model.id, ReactionType.Like)
      .subscribe(response => {
        this.isLiked = !_.isEmpty(response);
      });
  }

  private getLikeCount(): void {
    this._reactionsService.getCount(this.model.id, ReactionType.Like)
      .subscribe(response => {
        this.likeCount = response;
      });
  }
}
