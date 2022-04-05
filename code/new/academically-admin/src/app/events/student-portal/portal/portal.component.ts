import { Component, OnInit, Injector, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { EventDto, EventsServiceProxy, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { takeUntil } from 'rxjs/operators';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { EventStartingComponent } from './_components/event-starting/event-starting.component';
import { environment } from 'environments/environment';

enum StreamTrackType {
  Audio = 'audio',
  Video = 'video',
}

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.less'],
  animations: [appModuleAnimation()],
})
export class PortalComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild('presenterVideoEl') presenterVideoEl: ElementRef;
  presenterVideo: HTMLVideoElement;
  presenterStream: MediaStream;

  peerConnection: RTCPeerConnection;

  model = new EventDto;
  eventId: string;
  preview = false;
  showSidebar = true;
  showDeviceSettings = false;
  eventStarted = true;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _location: Location,
    private _router: Router,
    private _modalService: BsModalService,
    private _eventsService: EventsServiceProxy,
  ) {
    super(injector);
    route.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('event-id')) {
        this.eventId = paramMap.get('event-id');
        this.getEvent();
      }
    });
  }

  ngAfterViewInit(): void {
    this.presenterVideo = this.presenterVideoEl.nativeElement;
  }

  async ngOnInit(): Promise<void> {
    await this.initializeWebRTC();
    await this.initializeSessionsHub();
  }

  onExitClick(): void {
    if (this.preview) {
      this._location.back();
    } else {
      this._router.navigate(['/app/home/events']);
    }
  }

  onGoLiveClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<EventStartingComponent>;
    const modal = this._modalService.show(EventStartingComponent, modalSettings).content;
    modal.eventStarted.pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.eventStarted = response;
      });
  }

  onJoinClick(): void {
    this.eventStarted = true;
  }

  private getEvent(): void {
    this._eventsService.get(this.eventId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.model = response;
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

  private async initializeDevice(): Promise<void> {
    this.presenterStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: {
          exact: 1280
        },
        height: {
          exact: 720
        },
      },
      audio: {
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
          break;
      }
    });

    this.presenterVideo.srcObject = this.presenterStream;
    this.presenterVideo.volume = 0;
    // this.remoteVideo.srcObject = this.remoteStream;

    // this.sessionState = SessionState.Initiated;
  }

  private async initializeSessionsHub(): Promise<void> {
    await this.initializeDevice();
  }
}
