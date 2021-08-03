import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Injector } from '@angular/core';
import {
  SessionsServiceProxy,
  SessionCandidateDto,
  SessionCandidateType,
  SessionDto,
  ProfilesServiceProxy,
  CalendarEventsServiceProxy,
  UserDto,
  CalendarEventDto,
} from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.less'],
  animations: [appModuleAnimation()],
})
export class SessionsComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild('localVideoEl', { static: true }) localVideoEl: ElementRef;
  @ViewChild('remoteVideoEl', { static: true }) remoteVideoEl: ElementRef;

  calendarEvent: CalendarEventDto = new CalendarEventDto;
  calendarEventId: string;
  isLoading = false;
  peerConnection: RTCPeerConnection;
  localStream: MediaStream;
  remoteStream: MediaStream;
  localVideo: HTMLVideoElement;
  remoteVideo: HTMLVideoElement;
  meetingsHub: any;
  otherUser: UserDto;

  constructor(
    injector: Injector,
    private _activatedRoute: ActivatedRoute,
    private _sessionsService: SessionsServiceProxy,
    private _profilesService: ProfilesServiceProxy,
    private _calendarEventsService: CalendarEventsServiceProxy,
  ) {
    super(injector);
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            'stun:74.125.247.128:3478',
            'stun:[2001:4860:4864:4:8000::]:3478',
          ]
        },
        {
          urls: [
            'turn:74.125.247.128:3478?transport=udp',
            'turn:[2001:4860:4864:4:8000::]:3478?transport=udp',
            'turn:74.125.247.128:3478?transport=tcp',
            'turn:[2001:4860:4864:4:8000::]:3478?transport=tcp',
          ],
          username: 'CIWPkYcGEgbpfcnrnFYYqvGggqMKIICjBTAK',
          credential: 'DPHca2l2XLGAiCYkqpAVJUu5A+0=',
        },
      ],
      iceTransportPolicy: 'all',
      iceCandidatePoolSize: 10,
    });
    this._activatedRoute.paramMap.subscribe(paramMap => {
      this.calendarEventId = paramMap.get('calendar-event-id');
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.initializeHub();
  }

  ngAfterViewInit(): void {
    this.localVideo = this.localVideoEl.nativeElement;
    this.remoteVideo = this.remoteVideoEl.nativeElement;
  }

  async initializeDevice(): Promise<void> {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    this.remoteStream = new MediaStream();

    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    this.peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        this.remoteStream.addTrack(track);
      });
    };

    this.localVideo.srcObject = this.localStream;
    this.remoteVideo.srcObject = this.remoteStream;
  }

  onHangupClick(): void {

  }

  private initializeHub(): void {
    jQuery.getScript(AppConsts.appBaseUrl + '/assets/abp/abp.signalr-client.js', () => {
      abp.signalr.startConnection(abp.appPath + 'signalr-sessionsHub', (connection: any) => {
        this.meetingsHub = connection;

        connection.on('getCall', async (session: SessionDto) => {
          session = await this._sessionsService.get(this.calendarEventId).toPromise();
          if (!this.peerConnection.currentRemoteDescription && session.answer) {
            const answerDescription = JSON.parse(session.answer);
            this.peerConnection.setRemoteDescription(answerDescription);
            if (session.sessionCandidates) {
              _.filter(session.sessionCandidates, e => e.type === SessionCandidateType.Offer)
                .forEach(async offerCandidate => {
                  const iceCandidate = JSON.parse(offerCandidate.value);
                  await this.peerConnection.addIceCandidate(iceCandidate);
                });


              _.filter(session.sessionCandidates, e => e.type === SessionCandidateType.Answer)
                .forEach(async answerCandidate => {
                  const iceCandidate = JSON.parse(answerCandidate.value);
                  await this.peerConnection.addIceCandidate(iceCandidate);
                });
            }
          }
        });
      }).then(connection => {
        abp.event.trigger('connected');
        this._calendarEventsService.get(this.calendarEventId)
          .pipe(
            takeUntil(this.destroyed$),
          )
          .subscribe(calendarEvent => {
            this.calendarEvent = calendarEvent;
            const userCalendarEvent = _.first(_.filter(calendarEvent.userCalendarEvents, e => e.userId !== this.appSession.userId));
            this.initializeDevice()
              .then(() => {
                this.isLoading = false;
                if (this.isTutor) {
                  this._profilesService.get(userCalendarEvent.userId)
                    .subscribe(user => {
                      this.otherUser = user;
                      this.startSession()
                        .then(() => {

                        });
                    });
                } else {
                  // this.joinSession()
                  //   .then(() => {

                  //   });
                }
              });
          });
      });
    });
  }

  private async startSession(): Promise<void> {
    const session = await this._sessionsService.get(this.calendarEventId).toPromise();
    await this._sessionsService.deleteCandidates(session.id, SessionCandidateType.Offer).toPromise();

    this.peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        const sessionCandidate = new SessionCandidateDto();
        sessionCandidate.value = JSON.stringify(event.candidate.toJSON());
        sessionCandidate.sessionId = session.id;
        sessionCandidate.type = SessionCandidateType.Offer;
        const output = await this._sessionsService.createCandidate(sessionCandidate).toPromise();
      }
    };

    const offerDescription = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offerDescription);

    session.offer = JSON.stringify(offerDescription);
    await this._sessionsService.update(session).toPromise();
  }

  private async joinSession(): Promise<void> {
    const session = await this._sessionsService.get(this.calendarEventId).toPromise();
    await this._sessionsService.deleteCandidates(session.id, SessionCandidateType.Answer).toPromise();

    this.peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        const sessionCandidate = new SessionCandidateDto();
        sessionCandidate.value = JSON.stringify(event.candidate.toJSON());
        sessionCandidate.sessionId = session.id;
        sessionCandidate.type = SessionCandidateType.Answer;
        const output = await this._sessionsService.createCandidate(sessionCandidate).toPromise();
      }
    };

    const offer = JSON.parse(session.offer);
    await this.peerConnection.setRemoteDescription(offer);

    const answerDescription = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answerDescription);

    session.answer = JSON.stringify(answerDescription);
    await this._sessionsService.update(session).toPromise();
    this.meetingsHub.invoke('sendCall', session.id);
  }
}
