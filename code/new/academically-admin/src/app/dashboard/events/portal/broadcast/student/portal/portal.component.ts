import { Component, OnInit, Injector, ViewChild, ElementRef, AfterViewInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  EventDto,
  EventsServiceProxy,
  EventUserDto,
  EventSessionsServiceProxy,
  EventUserType,
  EventPollDto,
  ProfilesServiceProxy,
  ServiceOfferStatus,
  ServicesServiceProxy,
  ServiceOfferDto, QuestionDto, HubEvent, QuestionsServiceProxy, EventPollsServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { takeUntil } from 'rxjs/operators';
import { HubService } from '@app/_shared/services/hub.service';
import { PortalService } from './_services/portal.service';
import { SelectedMachineDevice } from './_components/device-settings/device-settings.component';
import * as _ from 'lodash';
import { HubConnection } from '@aspnet/signalr';
import { ShareVideosComponent } from './_components/share-videos/share-videos.component';
import * as rtc from 'rtc-lib';
import { PollSignalAction } from './_components/polls/polls.component';
import { PortalPollService } from './_components/polls/_services/portal-poll.service';
import { BsModalService, ModalOptions, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { ServiceOffersStateService, offersType } from '@shared/services/service-offers-state.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { ServiceOffersService } from '@shared/services/service-offers.service';
import { EventPollsStateService, pollsType } from '@shared/services/event-polls-state.service';
import { PollComponent } from './_components/polls/_components/poll/poll.component';

enum SignalAction {
  StartEvent,
  JoinEvent,
  EndEvent,
  GuestJoined,
  AutoAdmitChange,
  AdmitGuest,
  LobbyEntered,
  PingHost,
}

class SignalData<TObject> {
  action: SignalAction;
  data: string;

  constructor(action?: SignalAction, data?: TObject) {
    this.action = action;
    if (data !== undefined) {
      this.data = JSON.stringify(data);
    } else {
      this.data = '';
    }
  }

  public getDataObject(): TObject {
    return JSON.parse(this.data) as TObject;
  }
}

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.less'],
  animations: [appModuleAnimation()],
})
export class PortalComponent extends AppComponentBase implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('attendeeVideos') attendeeVideosEl: QueryList<ElementRef>;
  @ViewChild(ShareVideosComponent) shareVideosComponent: ShareVideosComponent;
  @ViewChild('presenterVideoEl') presenterVideoEl: ElementRef;

  offersStateService: ServiceOffersStateService;
  selectedOffer: ServiceOfferDto;

  pollsStateService: EventPollsStateService;
  pollWindowRef: any;
  selectedPoll: EventPollDto;

  liveQuestion: QuestionDto;
  answeringLiveQuestion: HubConnection;

  model = new EventDto;
  room: rtc.Room;
  allEventUsers: EventUserDto[] = [];
  attendees: EventUserDto[] = [];
  host = new EventUserDto();
  eventUser = new EventUserDto();
  joiningUsers: EventUserDto[] = [];
  selectedMachineDevice = new SelectedMachineDevice();

  eventId: string;
  invitationId: string;

  preview = false;
  showSidebar = true;
  showDeviceSettings = true;
  eventStarting = false;
  eventStarted = false;
  eventJoined = false;
  hubConnected = false;
  waiting = false;
  testMode = true;
  requestToSpeakDisabled = false;
  sharingWhiteboard = false;
  inLobby = false;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _location: Location,
    private _router: Router,
    private _hubService: HubService,
    private _eventsService: EventsServiceProxy,
    private _portalService: PortalService,
    private _portalPollService: PortalPollService,
    private _eventSessionsService: EventSessionsServiceProxy,
    private _eventPollsService: EventPollsServiceProxy,
    private _profilesService: ProfilesServiceProxy,
    private _modalService: BsModalService,
    private _modalDialogService: ModalDialogService,
    private _servicesService: ServicesServiceProxy,
    private _serviceOffersService: ServiceOffersService,
    private _questionsService: QuestionsServiceProxy
  ) {
    super(injector);
    this.pipeDestroy(route.paramMap, (paramMap) => {
      if (paramMap.has('invitation-id')) {
        this.invitationId = paramMap.get('invitation-id');
      }
    });
    this.pipeDestroy(route.parent.parent.paramMap, async (paramMap) => {
      if (paramMap.has('event-id')) {
        this.eventId = paramMap.get('event-id');
        await this.getEvent();
        await this.getEventUsers();
      }
    });
    this.pipeDestroy(this._portalService.admitGuest$, async (response) => {
      if (response) {
        const userIds = this.allEventUsers
          .filter(e => e.user.id !== this.eventUser.user.id)
          .map(e => e.user.id);
        await this.sendSignal(userIds, new SignalData(SignalAction.AdmitGuest, response));
      }
    });

    this._portalService.liveQuestion$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(question => {
        this.liveQuestion = question;
      });

    // polls
    this.pipeDestroy(this._portalPollService.pollSelected$, poll => this.selectedPoll = poll);
    this.pipeDestroy(this._portalPollService.pollSelectedMaximized$, isMaximized => this.handleSelectedPollMaximized(isMaximized));
  }

  get offersStateId(): string { return 'offers-event'; }
  get pollsStateId(): string { return 'polls-event'; }
  get isHost(): boolean {
    return this.model.creatorUserId === this.appSession.userId;
  }

  ngAfterViewInit(): void {
    this.attendeeVideosEl.changes.subscribe(async (val: any) => {
      if (this.attendeeVideosEl.length && !this.eventStarted) {
        const currentEl = this.attendeeVideosEl.last.nativeElement;
        await this.initDevice(currentEl);
      }
    });
  }

  async ngOnInit() {
    await this.initHub();
    await this.initOffersAppStates();
    await this.initPollsAppStates();
    await this.initLiveAnsweringQuestion();
  }

  async ngOnDestroy() {
    console.log('exit event');
    await this.pollsStateService?.stop();
    await this.offersStateService?.stop();
    // this.disconnectTrack(this.presenterStream);
    // this.disconnectTrack(this.attendeeStream);
  }

  async handleLiveAnswering(question: QuestionDto): Promise<void> {
    await this.answeringLiveQuestion.invoke('answerLiveQuestion', question);
  }

  async handleEndLiveAnswering(question: QuestionDto): Promise<void> {
    await this.answeringLiveQuestion.invoke('endAnswerLiveQuestion', question);
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

  handleSelectedPollMaximized(isMaximized: boolean): void {
    if (this.selectedPoll) {
      if (isMaximized) {
        const modalSettings = this.defaultModalSettings as ModalOptions<PollComponent>;
        modalSettings.class = 'modal-w-auto modal-dialog-centered';
        modalSettings.initialState = {
          poll: EventPollDto.fromJS({ ...this.selectedPoll}),
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

  async onLobbyEntered(selectedMachineDevice: SelectedMachineDevice): Promise<void> {
    this.inLobby = true;
    this.selectedMachineDevice = selectedMachineDevice;

    if (this.isHost) {
      this.initDevice(this.presenterVideoEl.nativeElement);
      const userIds = this.allEventUsers
        .filter(e => e.user.id !== this.eventUser.user.id)
        .map(e => e.user.id);
      this.sendSignal(userIds, new SignalData(SignalAction.LobbyEntered, this.eventUser));
    } else {
      this.attendees.push(this.eventUser);
      if (!this.model.autoAdmitAttendees) {
        this.sendSignal([this.host.user.id], new SignalData(SignalAction.LobbyEntered, this.eventUser));
      }
    }
  }

  async onStartEventClick(): Promise<void> {
    this.eventStarting = true;
    await this.joinRoom();
    const userIds = this.allEventUsers.map(e => e.user.id);
    this.sendSignal(userIds, new SignalData(SignalAction.StartEvent));
  }

  async onEndEventClick(): Promise<void> {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('EndEventConfirmation'),
      confirmCb: async () => {
        const userIds = this.allEventUsers.map(e => e.user.id);
        this.sendSignal(userIds, new SignalData(SignalAction.EndEvent));
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  async onShareVideo(file: File): Promise<void> {
    // @TODO: replace with logic that uses a separate room for other types of presentation
    this.room.leave();
    this.initRoom();
    const presenterVideo = this.presenterVideoEl.nativeElement as HTMLVideoElement;
    presenterVideo.src = URL.createObjectURL(file);
    presenterVideo.srcObject = undefined;
    presenterVideo.pause();
    presenterVideo.controls = true;
    presenterVideo.volume = 1;
    presenterVideo.muted = false;
    const stream = (presenterVideo as any).captureStream() as MediaStream;
    await this.room.local.addStream(new rtc.Stream(stream));
    await this.joinRoom();
    await presenterVideo.play();
  }

  async onUnshareVideo(): Promise<void> {
    this.room.leave();
    this.initRoom();
    await this.initDevice(this.presenterVideoEl.nativeElement);
    await this.joinRoom();
  }

  onShareWhiteboardClick(): void {
    this.sharingWhiteboard = true;
  }

  async onJoinClick(): Promise<void> {
    if (this.model.autoAdmitAttendees) {
      await this.joinRoom();
      this.eventJoined = true;
    } else {
      this.waiting = true;
      await this.sendSignal([this.host.user.id], new SignalData(SignalAction.GuestJoined, this.eventUser));
    }
  }

  async onRequestToSpeakClick(): Promise<void> {
  }

  async onAutoAdmitChange(): Promise<void> {
    this._portalService.event = this.model;
    this.pipeDestroy(this._eventsService.updateAutoAdmit(this.model.id, this.model.autoAdmitAttendees));
    const userIds = this.allEventUsers
      .filter(e => e.user.id !== this.eventUser.user.id)
      .map(e => e.user.id);
    await this.sendSignal(userIds, new SignalData(SignalAction.AutoAdmitChange, this.model.autoAdmitAttendees));
  }

  private async initHub(): Promise<void> {
    this.hub = await this._hubService.getEventSessionsHub(() => {
      this.hubConnected = true;
      this._portalService.hub = this.hub;
      this.initRoom();
      this.handleHubEvents();
    });
  }

  private initRoom(): void {
    const ws = 'wss://easy.innovailable.eu/' + encodeURI(this.eventId);
    const channel = new rtc.WebSocketChannel(ws);
    const signaling = new rtc.MucSignaling(channel);
    const options = {
      stun: 'stun:stun.innovailable.eu',
    };

    this.room = new rtc.Room(signaling, options);
    this.room.on('peer_joined', (peer: rtc.RemotePeer) => {
      console.log('joining peer');
      console.log(this.joiningUsers);
      if (this.joiningUsers.length > 0) {
        const eventUser = this.joiningUsers[0];
        const i = this.joiningUsers.findIndex(e => e === eventUser);
        this.joiningUsers.splice(i, 1);

        if (eventUser.type === EventUserType.Host) {
          console.log('host user joined');
          const hostVideo = new rtc.MediaDomElement(this.presenterVideoEl.nativeElement, peer);
        } else {
          this.attendees.push(eventUser);
          setTimeout(() => {
            console.log('attendee user joined');
            const videoEl = this.attendeeVideosEl.find(e => +e.nativeElement.id === eventUser.user.id);
            const attendeeVideo = new rtc.MediaDomElement(videoEl.nativeElement, peer);
          });
        }

        console.log('peer joined');
      }
    });
  }

  private async initDevice(videoEl: HTMLVideoElement): Promise<void> {
    const stream = await this.room.local.addStream({
      video: {
        deviceId: this.selectedMachineDevice.videoDevice.id,
      },
      audio: {
        deviceId: this.selectedMachineDevice.audioDevice.id,
        echoCancellation: {
          exact: true,
        },
        // @ts-ignore
        googEchoCancellation: { exact: true },
        googAutoGainControl: { exact: true },
        googNoiseSuppression: { exact: true },
      },
    });
    const videoDom = new rtc.MediaDomElement(videoEl, stream);
  }

  private handleHubEvents(): void {
    this.receiveSignal(async (sSignalData: string) => {
      let modal: BsModalRef;
      const signalData = new SignalData();
      Object.assign(signalData, JSON.parse(sSignalData));

      switch (signalData.action) {
        case SignalAction.StartEvent:
          console.log('receieveSignal - StartEvent');
          this.eventStarting = false;
          this.eventStarted = true;
          break;

        case SignalAction.JoinEvent:
          console.log('receieveSignal - JoinEvent');
          const joinedEventUser = signalData.getDataObject() as EventUserDto;
          this.joiningUsers.push(joinedEventUser);
          this._portalService.attendeeJoined = joinedEventUser;
          break;

        case SignalAction.EndEvent:
          console.log('receieveSignal - EndEvent');
          this.eventStarted = false;
          this.eventJoined = false;
          break;

        case SignalAction.GuestJoined:
          console.log('receieveSignal - GuestJoined');
          const guestEventUser = signalData.getDataObject() as EventUserDto;
          this._portalService.guestJoined = guestEventUser;
          break;

        case SignalAction.AutoAdmitChange:
          console.log('receieveSignal - AutoAdmitChange');
          const autoAdmit = signalData.getDataObject() as boolean;
          this.model.autoAdmitAttendees = autoAdmit;
          this._portalService.event = this.model;
          break;

        case SignalAction.AdmitGuest:
          console.log('receieveSignal - AdmitGuest');
          const userToAdmit = signalData.getDataObject() as EventUserDto;
          if (userToAdmit.user.id === this.eventUser.user.id) {
            await this.joinRoom();
            this.eventJoined = true;
          }
          break;

        case SignalAction.LobbyEntered:
          console.log('receieveSignal - LobbyEntered');
          const lobbyUser = signalData.getDataObject() as EventUserDto;
          console.log(lobbyUser);

          if (!this.allEventUsers.some(u => u.user.id === lobbyUser.user.id)) {
            this.allEventUsers.push(lobbyUser);
            this._portalService.attendees = this.allEventUsers.filter(e => e.type !== EventUserType.Host);
          }

          if (lobbyUser.user.id !== this.host.user.id) {
            console.log(lobbyUser.user.fullName + ' has entered');
            this._portalService.lobbyUser = lobbyUser;
          } else {
            if (!this.model.autoAdmitAttendees && this.inLobby) {
              this.sendSignal([this.host.user.id], new SignalData(SignalAction.LobbyEntered, this.eventUser));
            }
          }
          break;
      }

      switch (signalData.action as number as PollSignalAction) {
        case PollSignalAction.SharePoll:
        case PollSignalAction.PollStopped:
        case PollSignalAction.PollClosed:
          console.log(modal);
          if (modal) {
            modal.hide();
            modal = undefined;
          }
          break;
      }
    });
  }

  private async joinRoom(): Promise<void> {
    const userIds = this.allEventUsers
      .filter(e => e.user.id !== this.eventUser.user.id)
      .map(e => e.user.id);
    await this.sendSignal(userIds, new SignalData(SignalAction.JoinEvent, this.eventUser));
    await this.room.connect();
  }

  async getEvent() {
    this._eventsService.get(this.eventId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.model = response;
        this._portalService.event = this.model;
        if (this.appSession.user) {
        } if (this.invitationId) {
          console.warn('has invitation!');
        }
      });
  }

  async getEventUsers() {
    this._eventSessionsService.getUsers(this.eventId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(async responses => {
        this.allEventUsers = responses;
        if (!this.allEventUsers.some(u => u.user.id === this.appSession.userId)) {
          try {
            const user = await this._profilesService.get(this.appSession.userId).toPromise();
            this.allEventUsers.push(EventUserDto.fromJS({ user, type: EventUserType.Guest }));
          } catch (err) {
            console.error(err);
          }
        }
        this.host = this.allEventUsers.find(e => e.type === EventUserType.Host);
        this.eventUser = this.allEventUsers.find(e => e.user.id === this.appSession.userId);
        this._portalService.attendees = this.allEventUsers.filter(e => e.type !== EventUserType.Host);
      });
  }

  private disconnectTrack(stream: MediaStream): void {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = false;
        track.stop();
        setTimeout(() => {
          stream.removeTrack(track);
          console.log('audo track removed');
        }, 500);
      });
      stream.getVideoTracks().forEach(track => {
        track.enabled = false;
        track.stop();
        setTimeout(() => {
          stream.removeTrack(track);
          console.log('video track removed');
        }, 500);
      });
    }
  }

  private async initLiveAnsweringQuestion(): Promise<void> {
    this.answeringLiveQuestion = await this._hubService.getAnsweringLiveQuestionHub();
    this.answeringLiveQuestion.on(HubEvent[HubEvent.AnsweringLiveQuestion], (question: QuestionDto) => {
      this.liveQuestion = question;
    });

    this.answeringLiveQuestion.on(HubEvent[HubEvent.EndAnsweringLiveQuestion], (question: QuestionDto) => {
      this.liveQuestion = null;
      this.createQuestion(question);
    });
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
}
