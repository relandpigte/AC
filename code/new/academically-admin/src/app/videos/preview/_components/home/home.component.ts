import { Component, OnInit, Injector } from '@angular/core';
import { PreviewService } from '../../_services/preview.service';
import {
  VideoDto,
  StudentVideosServiceProxy,
  StudentVideoDto,
  VideoType,
  ReactionsServiceProxy,
  ReactionType,
  UserFollowerDto,
  UserFollowersServiceProxy,
  GetStudentVideoDto,
  PricingType,
} from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent extends AppComponentBase implements OnInit {
  model = new VideoDto();
  studentVideo = new GetStudentVideoDto();
  parentStudentVideo = new GetStudentVideoDto();
  preview = true;
  likeCount = 0;
  isLiked = false;
  userFollower: UserFollowerDto;

  VideoType = VideoType;
  PricingType = PricingType;

  constructor(
    injector: Injector,
    private _previewService: PreviewService,
    private _studentVideosService: StudentVideosServiceProxy,
    private _reactionsService: ReactionsServiceProxy,
    private _userFollowersService: UserFollowersServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._previewService.video$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id) {
          this.model = response;
          this.getUserFollower();
          this.getStudentVideo();
          this.getLike();
          this.getLikeCount();
          if (this.model && this.model.parentId) {
            this.getParentStudentVideo();
          }
        }
      });
    this._previewService.preview$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.preview = response;
      });
  }

  onSaveClick(): void {
    const newStudentVideo = new StudentVideoDto();
    newStudentVideo.videoId = this.model.id;
    newStudentVideo.saveOnly = true;
    this._studentVideosService.create(newStudentVideo)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.getStudentVideo();
      });
  }

  onUnsaveClick(): void {
    this._studentVideosService.delete(this.studentVideo.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.notify.success(this.l('UnsavedSuccessfully'));
        this.getStudentVideo();
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

  onPurchaseClick(video: VideoDto): void {
    const confirmationMessageLocale = video.type === VideoType.SingleVideo ? 'PurchaseVideoConfirmationMessage' : 'PurchaseVideoSeriesConfirmationMessage';
    this.message.confirm(this.l(confirmationMessageLocale), undefined,
      (result => {
        if (result) {
          const studentVideo = new StudentVideoDto();
          studentVideo.videoId = video.id;
          studentVideo.saveOnly = false;
          this._studentVideosService.create(studentVideo)
            .pipe(
              takeUntil(this.destroyed$),
            )
            .subscribe(response => {
              this._previewService.studentVideo = response;
              if (response.videoId === this.model.id) {
                this.studentVideo = response;
              } else {
                this.parentStudentVideo = response;
                this.getStudentVideo();
              }
              const messageLocale = video.type === VideoType.SingleVideo ? 'VideoPurchaseSuccessMessage' : 'VideoSeriesPurchaseSuccessMessage';
              this.notify.success(this.l(messageLocale));
            });
        }
      }));
  }

  private getStudentVideo(): void {
    this._studentVideosService.getByVideo(this.model.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.studentVideo = response;
      });
  }

  private getParentStudentVideo(): void {
    this._studentVideosService.getByVideo(this.model.parentId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.parentStudentVideo = response;
      });
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

  private getUserFollower(): void {
    this._userFollowersService.get(this.model.creatorUser.id, this.appSession.userId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.userFollower = response;
      });
  }
}
