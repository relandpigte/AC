import { Component, OnInit, Injector, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  EventDto,
  EventPresenterDto,
  EventsServiceProxy,
  ProfilesServiceProxy,
  StudentEventDto,
  UpdateProfileDto,
} from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { takeUntil } from 'rxjs/operators';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { EventStartingComponent } from './_components/event-starting/event-starting.component';
import { environment } from 'environments/environment';
import { HubService } from '@app/_shared/services/hub.service';
import { PortalService } from './_services/portal.service';
import { SelectedMachineDevice } from './_components/device-settings/device-settings.component';
import * as _ from 'lodash';
import { HubConnection } from '@aspnet/signalr';
import { ShareVideosComponent } from './_components/share-videos/share-videos.component';

enum StreamTrackType {
  Audio = 'audio',
  Video = 'video',
}

enum SessionStatus {
  Initializing,
  GoLiveReady,
  Started,
}

class Session {
  status = SessionStatus.Initializing;
  offer: string;
  answer: string;
  offerIceCandidates: string[] = [];
}

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.less'],
  animations: [appModuleAnimation()],
})
export class PortalComponent extends AppComponentBase implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(ShareVideosComponent) shareVideosComponent: ShareVideosComponent;

  @ViewChild('presenterVideoEl') presenterVideoEl: ElementRef;
  presenterVideo: HTMLVideoElement;
  presenterStream: MediaStream;

  @ViewChild('attendeeVideoEl') attendeeVideoEl: ElementRef;
  attendeeVideo: HTMLVideoElement;
  attendeeStream: MediaStream;

  eventSessionsHub: HubConnection;
  peerConnection: RTCPeerConnection;

  model = new EventDto;
  studentEvent = new StudentEventDto();
  eventPresenter = new EventPresenterDto();
  selectedMachineDevice = new SelectedMachineDevice();
  audiences: StudentEventDto[] = [];
  eventPresenters: EventPresenterDto[] = [];
  eventId: string;
  sessionId: string;
  invitationId: string;

  preview = false;
  showSidebar = true;
  showDeviceSettings = true;
  eventStarted = false;
  eventJoined = false;
  audienceJoined = false;
  hubConnected = false;
  waiting = false;
  testMode = true;

  session = new Session();

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _location: Location,
    private _router: Router,
    private _modalService: BsModalService,
    private _hubService: HubService,
    private _eventsService: EventsServiceProxy,
    private _portalService: PortalService,
    private _profilesService: ProfilesServiceProxy,
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('invitation-id')) {
        this.invitationId = paramMap.get('invitation-id');
        this.getEventPresenter();
      }
    });
    route.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('event-id')) {
        this.eventId = paramMap.get('event-id');
        this.getEvent();
        this.getAllAudiences();
        this.getAllPresenters();
      }
    });
    this._portalService.audiences$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        this.audiences = responses;
      });
    this._portalService.presenters$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        this.eventPresenters = responses;
      });
    this._portalService.admitGuest$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          this.eventSessionsHub.invoke('admitGuest', this.model.creatorUserId, response, JSON.stringify(this.session))
            .then(() => {
              // do nothing
            });
        }
      });
  }

  get isHost(): boolean {
    return this.model.creatorUserId === this.appSession.userId;
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    console.log('exit event');
    this.disconnectTrack(this.presenterStream);
    this.disconnectTrack(this.attendeeStream);
  }

  onExitClick(): void {
    if (this.preview) {
      this._location.back();
    } else {
      this._router.navigate(['/app/home/events']);
    }
  }

  async onGoLiveClick(): Promise<void> {
    const audienceIds = this.audiences.map(e => e.creatorUser.id);
    const presenterIds = this.eventPresenters.map(e => e.userId);
    const attendeeIds = [...audienceIds, ...presenterIds];
    if (this.testMode) {
      this.eventStarted = true;
      this.eventJoined = true;
      console.log(attendeeIds);
      await this.eventSessionsHub.invoke('startEvent', attendeeIds, JSON.stringify(this.session));
    } else {
      const modalSettings = this.defaultModalSettings as ModalOptions<EventStartingComponent>;
      const modal = this._modalService.show(EventStartingComponent, modalSettings).content;
      modal.eventStarted.pipe(takeUntil(this.destroyed$))
        .subscribe(async response => {
          this.eventStarted = response;
          this.eventJoined = response;
          await this.eventSessionsHub.invoke('startEvent', attendeeIds, JSON.stringify(this.session));
        });
    }
  }

  onShareVideoClick(): void {
    this.shareVideosComponent.uploadFiles();
  }

  async onShareVideo(file: File): Promise<void> {
    this.presenterVideo.srcObject = undefined;
    this.presenterVideo.src = URL.createObjectURL(file);
    this.presenterVideo.pause();
    this.presenterVideo.controls = true;
    this.presenterVideo.volume = 1;
    this.presenterVideo.muted = false;
    setTimeout(async () => {
      await this.initializeWebRTC();
      this.session = new Session();
      this.presenterStream = (this.presenterVideo as any).captureStream();
      this.presenterStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.presenterStream);
      });

      this.peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach(track => {
          this.attendeeStream.addTrack(track);
        });
      };
      await this.createOffers();
      const audienceIds = this.audiences.map(e => e.creatorUser.id);
      const presenterIds = this.eventPresenters.map(e => e.userId);
      const attendeeIds = [...audienceIds, ...presenterIds];
      setTimeout(async () => {
        console.log('invoke - streamVideo');
        console.log(this.session);
        await this.eventSessionsHub.invoke('streamVideo', attendeeIds, JSON.stringify(this.session));
        await this.presenterVideo.play();
      }, 3000);
    }, 500);
  }

  async onUnshareVideo(): Promise<void> {
    this.presenterVideo.controls = false;
    await this.initializeWebRTC();
    await this.initializeHostDevice();
    await this.createOffers();
    const audienceIds = this.audiences.map(e => e.creatorUser.id);
    const presenterIds = this.eventPresenters.map(e => e.userId);
    const attendeeIds = [...audienceIds, ...presenterIds];
    await this.eventSessionsHub.invoke('stopVideoStream', attendeeIds, JSON.stringify(this.session));
  }

  async onRoomJoined(selectedMachineDevice: SelectedMachineDevice): Promise<void> {
    if (selectedMachineDevice.firstName && selectedMachineDevice.lastName) {
      this._profilesService.updateProfile(new UpdateProfileDto({
        firstName: selectedMachineDevice.firstName,
        lastName: selectedMachineDevice.lastName,
      }))
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          this.appSession.user.name = selectedMachineDevice.firstName;
          this.appSession.user.surname = selectedMachineDevice.lastName;
          this.getEventPresenter();
          this.getAllPresenters();
        });
    }
    this.selectedMachineDevice = selectedMachineDevice;
    await this.initializeWebRTC();
    await this.initializeSessionsHub();
    if (this.isHost) {
      this.presenterVideo = this.presenterVideoEl.nativeElement;
      this.attendeeVideo = this.attendeeVideoEl.nativeElement;
      await this.initializeHostDevice();
      await this.createOffers();
    } else {
      this.audienceJoined = true;
      this.attendeeVideo = this.attendeeVideoEl.nativeElement;
      this.presenterVideo = this.presenterVideoEl.nativeElement;
      await this.initializeAttendeeDevice();
    }
  }

  async onJoinClick(): Promise<void> {
    if (this.eventPresenter.id) {
      this.waiting = true;
      await this.eventSessionsHub.invoke('waitAsGuest', this.model.creatorUserId, this.eventPresenter);
    } else {
      this.eventJoined = true;
      await this.createAnswers();
    }
  }

  private getEvent(): void {
    this._eventsService.get(this.eventId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.model = response;
        this._portalService.event = this.model;
        if (this.appSession.user) {
          this.getStudentEvent();
        } if (this.invitationId) {
          console.warn('has invitation!');
        }
      });
  }

  private getStudentEvent(): void {
    this._eventsService.getPurchased(this.model.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.studentEvent = response;
      });
  }

  private getEventPresenter(): void {
    this._eventsService.getPresenter(this.invitationId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.eventPresenter = response;
      });
  }

  private async initializeWebRTC(): Promise<void> {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: environment.webRtc.stun.servers,
        },
        {
          urls: environment.webRtc.turn.servers,
          username: environment.webRtc.turn.username,
          credential: environment.webRtc.turn.password,
        },
      ],
      iceTransportPolicy: 'all',
      iceCandidatePoolSize: 10,
    });
  }

  private async initializeHostDevice(): Promise<void> {
    this.presenterStream = await navigator.mediaDevices.getUserMedia({
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
    this.presenterStream.getTracks().forEach(track => {
      switch (track.kind) {
        case StreamTrackType.Audio:
          this.peerConnection.addTrack(track, this.presenterStream);
          break;
        case StreamTrackType.Video:
          this.peerConnection.addTrack(track, this.presenterStream);
          break;
      }
    });
    this.presenterVideo.srcObject = this.presenterStream;
    this.presenterVideo.volume = 0;
    this.presenterVideo.muted = true;

    this.attendeeStream = new MediaStream();
    this.peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        this.attendeeStream.addTrack(track);
      });
    };
    this.attendeeVideo.srcObject = this.attendeeStream;
  }

  private async initializeAttendeeDevice(): Promise<void> {
    this.attendeeStream = await navigator.mediaDevices.getUserMedia({
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
    this.attendeeStream.getTracks().forEach(track => {
      switch (track.kind) {
        case StreamTrackType.Audio:
          this.peerConnection.addTrack(track, this.attendeeStream);
          break;
        case StreamTrackType.Video:
          this.peerConnection.addTrack(track, this.attendeeStream);
          break;
      }
    });
    this.attendeeVideo.srcObject = this.attendeeStream;
    this.attendeeVideo.volume = 0;
    this.attendeeVideo.muted = true;

    this.presenterStream = new MediaStream();
    this.peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        this.presenterStream.addTrack(track);
      });
    };
    this.presenterVideo.srcObject = this.presenterStream;
  }

  private async createOffers(): Promise<void> {
    this.peerConnection.onicecandidate = async (event) => {
      console.log(event.candidate);
      if (event && event.candidate) {
        this.session.offerIceCandidates.push(JSON.stringify(event.candidate.toJSON()));
      }
    };

    const offerDescription = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offerDescription);
    this.session.offer = JSON.stringify(offerDescription);
  }

  private async createAnswers(): Promise<void> {
    this.peerConnection.onicecandidate = async (event) => {
      console.log(event.candidate);
      if (event && event.candidate) {
        await this.eventSessionsHub.invoke('addIceCandidate', this.model.creatorUserId, JSON.stringify(event.candidate.toJSON()));
      }
    };

    const offer = JSON.parse(this.session.offer);
    await this.peerConnection.setRemoteDescription(offer);

    const answerDescription = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answerDescription);
    this.session.answer = JSON.stringify(answerDescription);

    if (!this.eventPresenter.id) {
      await this.eventSessionsHub.invoke('joinAsAudience', this.model.creatorUserId, this.studentEvent, JSON.stringify(this.session));
    } else {
      await this.eventSessionsHub.invoke('joinAsGuest', this.model.creatorUserId, this.eventPresenter, JSON.stringify(this.session));
    }
  }

  private async admitAttendee(): Promise<void> {
    if (this.isHost) {
      const answerDescription = JSON.parse(this.session.answer);
      await this.peerConnection.setRemoteDescription(answerDescription);
      console.warn(this.peerConnection.remoteDescription);
    } else {
      if (this.session.offerIceCandidates && this.session.offerIceCandidates.length) {
        _.forEach(this.session.offerIceCandidates, async offerIceCandidate => {
          console.log('offer ice candidate added');
          const iceCandidate = JSON.parse(offerIceCandidate);
          await this.peerConnection.addIceCandidate(iceCandidate);
        });
      }
    }
  }

  private getAllAudiences(): void {
    this._eventsService.getAllAudiences(this.eventId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        this._portalService.audiences = responses;
      });
  }

  private getAllPresenters(): void {
    this._eventsService.getAllPresenters(this.eventId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        this._portalService.presenters = responses;
      });
  }

  private async initializeSessionsHub(): Promise<void> {
    this.eventSessionsHub = await this._hubService.getEventSessionsHub(async () => {
      this.hubConnected = true;
      if (!this.isHost) {
        if (!this.eventPresenter.id) {
          await this.eventSessionsHub.invoke('enterAsAudience', this.model.creatorUserId, this.studentEvent);
        } else {
          console.log(this.eventPresenter);
          await this.eventSessionsHub.invoke('enterAsGuest', this.model.creatorUserId, this.eventPresenter);
        }
      }
    });

    this.eventSessionsHub.on('eventStarted', async (sessionStr: string) => {
      console.log('eventStarted');
      const session: Session = JSON.parse(sessionStr);
      this.session.offer = session.offer;
      this.session.offerIceCandidates = session.offerIceCandidates;
      console.log(this.session);
      this.eventStarted = true;
    });

    this.eventSessionsHub.on('audienceEntered', async (audienceStudentEvent: StudentEventDto) => {
      if (this.eventStarted) {
        console.log('audienceEntered');
        await this.eventSessionsHub.invoke('startEvent', [audienceStudentEvent.creatorUser.id], JSON.stringify(this.session));
      }
    });

    this.eventSessionsHub.on('audienceJoined', async (audienceStudentEvent: StudentEventDto, sessionStr: string) => {
      if (this.eventJoined) {
        console.log('audienceJoined');
        const session: Session = JSON.parse(sessionStr);
        this.session.answer = session.answer;
        console.log(this.session);
        this.audienceJoined = true;
        this._portalService.audienceJoined = audienceStudentEvent;
        await this.admitAttendee();
      }
    });

    this.eventSessionsHub.on('guestEntered', async (guestEventPresenter: EventPresenterDto) => {
      if (this.eventStarted) {
        console.log('guestEntered');
        await this.eventSessionsHub.invoke('startEvent', [guestEventPresenter.creatorUserId], JSON.stringify(this.session));
      }
    });

    this.eventSessionsHub.on('guestJoined', async (guestEventPresenter: EventPresenterDto, sessionStr: string) => {
      if (this.eventJoined) {
        console.log('guestJoined');
        const session: Session = JSON.parse(sessionStr);
        this.session.answer = session.answer;
        console.log(this.session);
        this.audienceJoined = true;
        await this.admitAttendee();
      }
    });

    this.eventSessionsHub.on('guestWaiting', async (guestEventPresenter: EventPresenterDto) => {
      console.log('guestWaiting');
      this._portalService.guestJoined = guestEventPresenter;
    });

    this.eventSessionsHub.on('guestAdmitted', async (guestEventPresenter: EventPresenterDto, sessionStr: string) => {
      console.log('guestAdmitted');
      this.eventJoined = true;
      await this.createAnswers();
    });

    this.eventSessionsHub.on('iceCandidatedAdded', async (iceCandidateStr: string) => {
      console.log('iceCandidatedAdded');
      const iceCandidate = JSON.parse(iceCandidateStr);
      console.log('answer ice candidate added');
      await this.peerConnection.addIceCandidate(iceCandidate);
    });

    this.eventSessionsHub.on('videoStreamed', async (sessionStr: string) => {
      if (this.eventJoined) {
        console.log('videoStreamed');
        const session: Session = JSON.parse(sessionStr);
        this.session = new Session();
        this.session.offer = session.offer;
        this.session.offerIceCandidates = session.offerIceCandidates;
        console.log(this.session);
        await this.initializeWebRTC();
        await this.initializeAttendeeDevice();
        await this.createAnswers();
      }
    });

    this.eventSessionsHub.on('videoStreamStopped', async (sessionStr: string) => {
      if (this.eventJoined) {
        console.log('videoStreamStopped');
        const session: Session = JSON.parse(sessionStr);
        this.session = new Session();
        this.session.offer = session.offer;
        this.session.offerIceCandidates = session.offerIceCandidates;
        await this.initializeWebRTC();
        await this.initializeAttendeeDevice();
        await this.createAnswers();
      }
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
}
