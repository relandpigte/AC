import { Component, OnInit, Injector, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { environment } from 'environments/environment';
import { takeUntil, finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router, ActivatedRoute } from '@angular/router';

import { AppComponentBase } from '@shared/app-component-base';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CourseWizardComponent } from '@app/dashboard/courses/course-wizard/course-wizard.component';
import { AppConsts } from '@shared/AppConsts';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { DashboardService, DashboardServiceView } from '@app/dashboard/_services/dashboard.service';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { ChooseVideoTemplateComponent } from '@app/videos/_components/choose-video-template/choose-video-template.component';
import { VideoTemplate } from '@app/videos/_models/video-template';
import { CreateVideoComponent } from '@app/videos/_components/create-video/create-video.component';
import { VideoService } from '@app/videos/_services/video.service';
import { ChooseTemplateComponent as ChooseEvent } from '@app/dashboard/events/_components/choose-template/choose-template.component';
import { ChooseTemplateComponent as ChooseArticle } from '@app/articles/_components/choose-template/choose-template.component';
import { ChooseTemplateComponent as ChooseCoaching } from '@app/dashboard/coaching/_components/choose-template/choose-template.component';
import { EventsTemplate } from '@app/dashboard/events/_models/events-template';
import { CreateBroadcastComponent } from '@app/dashboard/events/_components/create-broadcast/create-broadcast.component';
import { ServiceDataService } from '@shared/services/service-data.service';
import { CreateWorkshopComponent } from '@app/dashboard/events/_components/create-workshop/create-workshop.component';
import { CoachingTemplate } from '@app/dashboard/coaching/_models/coaching-template';
import { CreateCoachingComponent } from '@app/dashboard/coaching/_components/create-coaching/create-coaching.component';
import { ArticleTemplate } from '@app/articles/_models/article-template';
import { CreateArticleComponent } from '@app/articles/_components/create-article/create-article.component';
import { ArticleService } from '@app/articles/_services/article.service';
import {
  UserLoginInfoDto, PaymentsServiceProxy, VideoDto, VideoStatus, VideoType, VideosServiceProxy, CreateEventDto,
  EventCategory, EventType, ServicesType, EventsServiceProxy, CreateCoachingDto, CoachingType, CoachingsServiceProxy,
  ArticleDto, ArticleStatus, ArticleType, ArticlesServiceProxy
} from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  animations: [appModuleAnimation()],
})
export class DashboardComponent extends AppComponentBase implements OnInit, AfterViewInit {
  user: UserLoginInfoDto = new UserLoginInfoDto();
  greetings: string;
  isOnboarding = false;

  shimmerType = ShimmerType;
  readonly DashboardServiceView = DashboardServiceView;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _paymentsService: PaymentsServiceProxy,
    private _modalDialogService: ModalDialogService,
    private _dashboardService: DashboardService,
    private _dashboardPageService: DashboardPagesService,
    private _cdr: ChangeDetectorRef,
    private _videosService: VideosServiceProxy,
    private _videoService: VideoService,
    private _eventsService: EventsServiceProxy,
    private _serviceData: ServiceDataService,
    private _coachingService: CoachingsServiceProxy,
    private _articlesService: ArticlesServiceProxy,
    private _articleService: ArticleService
  ) {
    super(injector);
    this.user = this.appSession.user;
  }

  get switchButtonText(): string { return this._dashboardService.switchButtonText(); }
  get userView(): string { return this._dashboardService.getUserView(); }
  get isLearnerView(): boolean { return this._dashboardService.getUserView() === DashboardServiceView.learner; }
  get isLoading$() { return this._dashboardPageService.isLoading$; }

  handleSwitchView(): void {
    this._dashboardService.handleSwitchView();
    this._cdr.detectChanges();
  }

  ngOnInit(): void {
    this.greetings = this.getGreetings();
    this._route.queryParams.subscribe(paramMap => {
      if (paramMap.code) {
        this.isOnboarding = true;
        this._paymentsService.onboardUser(paramMap.code)
          .pipe(
            takeUntil(this.destroyed$),
            finalize(() => {
              this.isOnboarding = false;
            }),
          )
          .subscribe(stripeUserId => {
            this.notify.success(this.l('StripeOnboardingSuccessMessage'));
            this.appSession.user.stripeUserId = stripeUserId;
            this.user.stripeUserId = stripeUserId;
            this._router.navigate(['/app/dashboard']);
          });
      } else {
        this.isOnboarding = false;
      }
    });

    setTimeout(() => this._dashboardPageService.setIsLoading(false), 3000);
  }

  ngAfterViewInit(): void {
    this._cdr.detectChanges();
  }

  getGreetings(): string {
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMin = currentTime.getMinutes();

    if (currentHours >= 5 && currentHours <= 11 && currentMin <= 59) {
      return this.l('GoodMorning');
    } else if (currentHours >= 12 && currentHours <= 16 && currentMin <= 59) {
      return this.l('GoodAfternoon');
    } else if (currentHours >= 17 || (currentHours >= 0 && currentHours <= 4) && currentMin <= 59) {
      return this.l('GoodEvening');
    }
  }

  onCreateCourseClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CourseWizardComponent>;
    this._modalService.show(CourseWizardComponent, modalSettings);
  }

  onCreateTutorialClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ChooseVideoTemplateComponent>;
    const modal = this._modalService.show(ChooseVideoTemplateComponent, modalSettings).content;
    modal.selectTemplate.subscribe((template: VideoTemplate): void => {
      const newVideo = new VideoDto();
      newVideo.type = template.type;
      newVideo.status = VideoStatus.Draft;
      newVideo.name = '';

      const createVideoModalSettings = this.defaultModalSettings as ModalOptions<CreateVideoComponent>;
      createVideoModalSettings.initialState = {
        model: newVideo,
      };
      const createVideoModal = this._modalService.show(CreateVideoComponent, createVideoModalSettings).content;
      createVideoModal.createCancel.subscribe(() => {
        this.onCreateTutorialClick();
      });
      createVideoModal.createVideo.subscribe(video => {
        this._videosService.create(video)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(async response => {
            this.notify.success(this.l('SavedSuccessfully'));
            this._videoService.videoCreated = video;
            if (response.type === VideoType.SingleVideo) {
              await this._router.navigate(['/app/videos/', response.id]);
            } else {
              await this._router.navigate(['/app/videos/video-series/', response.id]);
            }
          });
      });
    });
  }

  onCreateBroadcastClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ChooseEvent>;
    modalSettings.initialState = { type: 'Broadcast' };
    const modal = this._modalService.show(ChooseEvent, modalSettings).content;
    modal.selectTemplate.subscribe((template: EventsTemplate) => {
      const model = new CreateEventDto();
      model.name = '';
      model.category = EventCategory.Broadcast;
      model.type = template.type as EventType;

      const createBroadcastModalSettings = this.defaultModalSettings as ModalOptions<CreateBroadcastComponent>;
      createBroadcastModalSettings.initialState = { model: model };
      const createBroadcastModal = this._modalService.show(CreateBroadcastComponent, createBroadcastModalSettings).content;
      createBroadcastModal.createBroadcast.subscribe(broadcast => {
        this._eventsService.create(broadcast)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(async response => {
            this.notify.success(this.l('SavedSuccessfully'));
            if (response.type === EventType.Single) {
              await this._router.navigate(['/app/dashboard/events/broadcast/', response.id]);
            } else {
              await this._router.navigate(['/app/dashboard/events/broadcast/series/', response.id]);
            }
            this._serviceData.createServiceDiscussion(response.id, ServicesType.Event);
          });
      });
    });
  }

  onCreateWorkshopClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ChooseEvent>;
    modalSettings.initialState = { type: 'Workshop' };
    const modal = this._modalService.show(ChooseEvent, modalSettings).content;
    modal.selectTemplate.subscribe((template: EventsTemplate) => {
      const model = new CreateEventDto();
      model.name = '';
      model.category = EventCategory.Workshop;
      model.type = template.type as EventType;

      const createWorkshopModalSettings = this.defaultModalSettings as ModalOptions<CreateWorkshopComponent>;
      createWorkshopModalSettings.initialState = { model: model };
      const createWorkshopModal = this._modalService.show(CreateWorkshopComponent, createWorkshopModalSettings).content;
      createWorkshopModal.createWorkshop.subscribe(workshop => {
        this._eventsService.create(workshop)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(async response => {
            this.notify.success(this.l('SavedSuccessfully'));
            if (response.type === EventType.Single) {
              await this._router.navigate(['/app/dashboard/events/workshop/', response.id]);
            } else {
              await this._router.navigate(['/app/dashboard/events/workshop/series/', response.id]);
            }
            this._serviceData.createServiceDiscussion(response.id, ServicesType.Event);
          });
      });
    });
  }

  onCreateCoachingClick():  void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ChooseCoaching>;
    const modal = this._modalService.show(ChooseCoaching, modalSettings).content;
    modal.selectTemplate.subscribe((template: CoachingTemplate) => {
      const model = new CreateCoachingDto();
      model.name = '';
      model.type = template.type;

      const createCoachingModalSettings = this.defaultModalSettings as ModalOptions<CreateCoachingComponent>;
      createCoachingModalSettings.initialState = { model: model };
      const createCoachingModal = this._modalService.show(CreateCoachingComponent, createCoachingModalSettings).content;
      createCoachingModal.createCoaching.subscribe(coaching => {
        this._coachingService.create(coaching)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(async response => {
            this.notify.success(this.l('SavedSuccessfully'));
            if (response.type === CoachingType.Single) {
              await this._router.navigate(['/app/dashboard/coaching/', response.id]);
            } else {
              await this._router.navigate(['/app/dashboard/coaching/series/', response.id]);
            }
            this._serviceData.createServiceDiscussion(response.id, ServicesType.Coaching);
          });
      });
    });
  }

  onCreateArticleClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ChooseArticle>;
    const modal = this._modalService.show(ChooseArticle, modalSettings).content;
    modal.selectTemplate.subscribe((template: ArticleTemplate) => {
      const newArticle = new ArticleDto();
      newArticle.type = template.type;
      newArticle.status = ArticleStatus.Draft;
      newArticle.name = '';

      const createArticleModalSettings = this.defaultModalSettings as ModalOptions<CreateArticleComponent>;
      createArticleModalSettings.initialState = {
        model: newArticle,
      };
      const createArticleModal = this._modalService.show(CreateArticleComponent, createArticleModalSettings).content;
      createArticleModal.createCancel.subscribe(() => {
        this.onCreateArticleClick();
      });
      createArticleModal.createArticle.subscribe(article => {
        this._articlesService.create(article)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(async response => {
            this.notify.success(this.l('SavedSuccessfully'));
            this._articleService.articleCreated = article;
            if (response.type === ArticleType.SingleArticle) {
              await this._router.navigate(['/app/articles/', response.id]);
            } else {
              await this._router.navigate(['/app/articles/article-series/', response.id]);
            }
          });
      });
    });
  }

  onConnectStripeClick(): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('StripeOnboardingConfirmationMessage'),
      confirmCb: (): void => {
        window.location.href = environment.providers.stripe.onbloardLink(
          environment.providers.stripe.clientId,
          AppConsts.appBaseUrl
        );
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }
}
