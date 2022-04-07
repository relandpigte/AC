import { Component, OnInit, Injector, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { EventDto, EventsServiceProxy, StudentVideoDto, StudentEventDto } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { takeUntil } from 'rxjs/operators';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { EventStartingComponent } from './_components/event-starting/event-starting.component';
import { environment } from 'environments/environment';
import { HubService } from '@app/_shared/services/hub.service';
import { PortalService } from './_services/portal.service';

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

  eventSessionsHub: any;
  peerConnection: RTCPeerConnection;

  model = new EventDto;
  eventId: string;
  preview = false;
  showSidebar = true;
  showDeviceSettings = true;
  eventStarted = false;
  eventJoined = false;
  studentEvent = new StudentEventDto();

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _location: Location,
    private _router: Router,
    private _modalService: BsModalService,
    private _hubService: HubService,
    private _eventsService: EventsServiceProxy,
    private _portalService: PortalService,
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
    // const modalSettings = this.defaultModalSettings as ModalOptions<EventStartingComponent>;
    // const modal = this._modalService.show(EventStartingComponent, modalSettings).content;
    // modal.eventStarted.pipe(takeUntil(this.destroyed$))
    //   .subscribe(response => {
    //     this.eventStarted = response;
    //     this.eventJoined = response;
    //     this.eventSessionsHub.invoke('startEvent', [4]);
    //   });

    this.eventStarted = true;
    this.eventJoined = true;
    this.eventSessionsHub.invoke('startEvent', [4]);
  }

  onJoinClick(): void {
    this.eventJoined = true;
    this.eventSessionsHub.invoke('joinAsAudience', this.model.creatorUserId, this.studentEvent);
  }

  private getEvent(): void {
    this._eventsService.get(this.eventId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.model = response;
        this._portalService.event = this.model;
        this.getStudentVideoDto();
      });
  }

  private getStudentVideoDto(): void {
    this._eventsService.getPurchased(this.model.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.studentEvent = response;
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
  }

  private async initializeSessionsHub(): Promise<void> {
    this.eventSessionsHub = await this._hubService.getEventSessionsHub();

    await this.initializeDevice();

    this.eventSessionsHub.on('eventStarted', async () => {
      console.log('eventStarted');
      this.eventStarted = true;
    });

    this.eventSessionsHub.on('audienceJoined', async (audienceStudentEvent: StudentEventDto) => {
      console.log('audienceJoined');
      this._portalService.audience = audienceStudentEvent;
    });
  }
}
