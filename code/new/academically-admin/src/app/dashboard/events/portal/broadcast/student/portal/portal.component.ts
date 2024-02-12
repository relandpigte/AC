import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Injector, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentPortalBase, ServiceFeatureFlagMapping } from '@shared/app-component-portal-base';
import {
  EventPollDto,
  EventPollsServiceProxy,
  EventSessionsServiceProxy,
  EventUserDto,
  EventUserType,
  HubEvent,
  ProfilesServiceProxy,
  QuestionDto,
  QuestionsServiceProxy,
  ServiceOfferDto,
  ServicesServiceProxy
} from '@shared/service-proxies/service-proxies';
import { EventPollsStateService, pollsType } from '@shared/services/event-polls-state.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { ServiceOffersStateService, offersType } from '@shared/services/service-offers-state.service';
import { ServiceOffersService } from '@shared/services/service-offers.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';
import { PollComponent } from './_components/polls/_components/poll/poll.component';
import { PortalPollService } from './_components/polls/_services/portal-poll.service';
import { ShareVideosComponent } from './_components/share-videos/share-videos.component';
import { Observable } from 'rxjs';

export const ANSWERING_LIVE_QUESTION_HUB_NAME = 'answeringLiveQuestionHub';

const enum PortalFeatures {
  Microphone = 'microphone',
  Webcam = 'webcam',
  ShareContent = 'shareContent',
}

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.less'],
  animations: [appModuleAnimation()]
})
export class PortalComponent extends AppComponentPortalBase implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('presenterVideoEl') presenterVideoEl: ElementRef;
  @ViewChildren('attendeeVideos') attendeeVideosEl: QueryList<ElementRef>;
  @ViewChild(ShareVideosComponent) shareVideosComponent: ShareVideosComponent;

  featureToServiceFeatureFlags: ServiceFeatureFlagMapping = {
    [PortalFeatures.Microphone]: {
      [EventUserType.Audience]: ['InteractiveTools', 'interactiveToolsAudienceMicrophone'],
      [EventUserType.Guest]: ['InteractiveTools', 'interactiveToolsAudienceMicrophone'],
      [EventUserType.CoHost]: ['InteractiveTools', 'interactiveToolsCohostMicrophone'],
    },
    [PortalFeatures.Webcam]: {
      [EventUserType.Audience]: ['InteractiveTools', 'interactiveToolsAudienceWebCam'],
      [EventUserType.Guest]: ['InteractiveTools', 'interactiveToolsAudienceWebCam'],
      [EventUserType.CoHost]: ['InteractiveTools', 'interactiveToolsCohostWebCam'],
    },
    [PortalFeatures.ShareContent]: {
      [EventUserType.Audience]: ['InteractiveTools', 'InteractiveToolsAudienceSharing'],
      [EventUserType.Guest]: ['InteractiveTools', 'InteractiveToolsAudienceSharing'],
      [EventUserType.CoHost]: ['InteractiveTools'],
    },
  };

  offersStateService: ServiceOffersStateService;
  selectedOffer: ServiceOfferDto;

  pollsStateService: EventPollsStateService;
  pollWindowRef: any;
  selectedPoll: EventPollDto;

  liveQuestion: QuestionDto;

  invitationId: string;

  preview = false;
  showSidebar = true;

  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef,
    private _route: ActivatedRoute,
    private _location: Location,
    private _router: Router,
    private _portalPollService: PortalPollService,
    private _eventSessionsService: EventSessionsServiceProxy,
    private _eventPollsService: EventPollsServiceProxy,
    private _profilesService: ProfilesServiceProxy,
    private _modalService: BsModalService,
    private _servicesService: ServicesServiceProxy,
    private _serviceOffersService: ServiceOffersService,
    private _questionsService: QuestionsServiceProxy
  ) {
    super(injector);
  }

  get event$() { return this._portalService.event$; }

  get offersStateId(): string { return 'offers-event'; }
  get pollsStateId(): string { return 'polls-event'; }

  get isMicrophoneEnabled$(): Observable<boolean> { return this._portalService.getSpecificFeatureFlag$(this.featureToServiceFeatureFlags, PortalFeatures.Microphone, this.appSession.userId); }
  get isWebCamEnabled$(): Observable<boolean> { return this._portalService.getSpecificFeatureFlag$(this.featureToServiceFeatureFlags, PortalFeatures.Webcam, this.appSession.userId); }
  get isShareEnabled$(): Observable<boolean> { return this._portalService.getSpecificFeatureFlag$(this.featureToServiceFeatureFlags, PortalFeatures.ShareContent, this.appSession.userId); }

  async ngOnInit() {
    await super.ngOnInit();

    // routings
    this.pipeDestroy(this._route.paramMap, (paramMap) => {
      if (paramMap.has('invitation-id')) {
        this.invitationId = paramMap.get('invitation-id');
      }
    });

    this.pipeDestroy(this._route.paramMap, async (paramMap) => {
      if (paramMap.has('event-id')) {
        this.eventId = paramMap.get('event-id');
        await this.getEvent();
        await this.getEventUsers();
      }
    });

    // questions
    this.pipeDestroy(this._portalService.liveQuestion$, question => this.liveQuestion = question);

    // polls
    this.pipeDestroy(this._portalPollService.pollSelected$, poll => this.selectedPoll = poll);
    this.pipeDestroy(this._portalPollService.pollSelectedMaximized$, isMaximized => this.handleSelectedPollMaximized(isMaximized));

    await this.initOffersAppStates();
    await this.initPollsAppStates();
    await this.initLiveAnsweringQuestion();
  }

  ngAfterViewInit(): void {
    // Initialize portal (rtc) properties
    this.initPortal({
      serverProps: {
        signalingServerUrl: 'wss://easy.innovailable.eu/',
        stunServerUrl: 'stun:stun.innovailable.eu',
      },
      viewProps: {
        presenterVideoEl: this.presenterVideoEl,
        attendeeVideosEl: this.attendeeVideosEl
      }
    });
  }

  async ngOnDestroy() {
    super.ngOnDestroy();
    await this.pollsStateService?.stop();
    await this.offersStateService?.stop();
  }

  handleSelectedPollMaximized(isMaximized: boolean): void {
    if (this.selectedPoll) {
      if (isMaximized) {
        const modalSettings = this.defaultModalSettings as ModalOptions<PollComponent>;
        modalSettings.class = 'modal-w-auto modal-dialog-centered';
        modalSettings.initialState = {
          poll: EventPollDto.fromJS({ ...this.selectedPoll }),
          showBackButton: false,
          isModal: true
        };
        this.pollWindowRef = this._modalService.show(PollComponent, modalSettings);
      } else {
        this.pollWindowRef?.hide();
      }
    }
  }

  onOfferClick(offer: ServiceOfferDto): void {
    this._serviceOffersService.selectServiceOffer(offer);
  }

  onExitClick(): void {
    if (this.preview) {
      this._location.back();
    } else {
      this._router.navigate(['/app/dashboard/events']);
    }
  }

  onShareVideoClick(): void {
    this.shareVideosComponent.uploadFiles();
  }

  onShareWhiteboardClick(): void {
    this.sharingWhiteboard = true;
  }

  async onRequestToSpeakClick(): Promise<void> {
  }

  async getEvent() {
    this.pipeDestroy(this._eventsService.get(this.eventId), response => {
      this.eventModel = response;
      this._portalService.event = this.eventModel;
      this.getServiceFeatureFlags();
    });
  }

  async getEventUsers() {
    this.pipeDestroy(this._eventSessionsService.getUsers(this.eventId), async responses => {
      this.allEventUsers = responses;
      if (!this.allEventUsers.some(u => u.user.id === this.appSession.userId)) {
        try {
          const user = await this._profilesService.get(this.appSession.userId).toPromise();
          this.allEventUsers.push(EventUserDto.fromJS({ user, type: EventUserType.Guest }));
        } catch (err) {
          console.error(err);
        }
      }
      this.eventHost = this.allEventUsers.find(e => e.type === EventUserType.Host);
      this.eventUser = this.allEventUsers.find(e => e.user.id === this.appSession.userId);
      this._portalService.attendees = this.allEventUsers.filter(e => e.type !== EventUserType.Host);
    });
  }

  async handleLiveAnswering(question: QuestionDto): Promise<void> {
    await this.getHub(ANSWERING_LIVE_QUESTION_HUB_NAME).invoke('answerLiveQuestion', question);
  }

  async handleEndLiveAnswering(question: QuestionDto): Promise<void> {
    await this.getHub(ANSWERING_LIVE_QUESTION_HUB_NAME).invoke('endAnswerLiveQuestion', question);
  }

  private createQuestion(question: QuestionDto): void {
    if (!this.isHost) { return; }

    const q = new QuestionDto();
    q.body = 'Answered at <a href="!#" class="video-answered">12:00</a>';
    q.referenceId = question.referenceId;
    q.parentId = question.id;

    this._questionsService.create(q)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(x => x);
  }

  private async initOffersAppStates() {
    const appStateConfig: AppStateConfig = {
      [this.offersStateId]: {
        update: { referenceId: this.eventId }
      }
    };
    const appStateServices: AppStateServices = {
      [this.offersStateId]: {
        type: ServiceOffersStateService,
        args: [offersType.opened, this.appSession, this._hubService, this._servicesService]
      }
    };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.offersStateService = this.pubSubService.getStateService<ServiceOffersStateService>(this.offersStateId);
    this.offersStateService.offers$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      switch (event.type) {
        case 'launched':
          this.selectedOffer = event.data;
          break;
        case 'closed':
          this.selectedOffer = event.data;
          break;
      }
    });
  }

  private async initPollsAppStates() {
    const appStateConfig: AppStateConfig = {
      [this.pollsStateId]: {
        update: { referenceId: this.eventId }
      }
    };
    const appStateServices: AppStateServices = {
      [this.pollsStateId]: {
        type: EventPollsStateService,
        args: [pollsType.all, this.appSession, this._hubService, this._eventPollsService]
      }
    };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.pollsStateService = this.pubSubService.getStateService<EventPollsStateService>(this.pollsStateId);
    this.pollsStateService.polls$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      if (this.selectedPoll?.id === event?.data?.id) {
        this._portalPollService.pollSelected = event.data;
      }
      switch (event.type) {
        case 'launched':
          this._portalPollService.pollSelected = event.data;
          this._portalPollService.pollSelectedMaximized = true;
          break;
        case 'closed':
          break;
        case 'shared':
          if (!this.isHost) {
            this._portalPollService.pollSelected = event.data;
            this._portalPollService.pollSelectedMaximized = true;
          }
          break;
      }
    });
  }

  private async initLiveAnsweringQuestion(): Promise<void> {
    this.addHub(ANSWERING_LIVE_QUESTION_HUB_NAME, await this._hubService.getAnsweringLiveQuestionHub());
    this.getHub(ANSWERING_LIVE_QUESTION_HUB_NAME).on(HubEvent[HubEvent.AnsweringLiveQuestion], (question: QuestionDto) => {
      this.liveQuestion = question;
    });

    this.getHub(ANSWERING_LIVE_QUESTION_HUB_NAME).on(HubEvent[HubEvent.EndAnsweringLiveQuestion], (question: QuestionDto) => {
      this.liveQuestion = null;
      this.createQuestion(question);
    });
    this.startHubConnection(ANSWERING_LIVE_QUESTION_HUB_NAME);
  }

  private getServiceFeatureFlags(): void {
    const { id } = this.eventModel || {};
    this.pipeDestroy(this._servicesService.getFeatureFlags(id), response => {
      this._portalService.featureFlags = response;
    });
  }
}
