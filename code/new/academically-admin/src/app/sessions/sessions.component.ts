import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Injector } from '@angular/core';
import {
  SessionsServiceProxy,
  SessionCandidateDto,
  SessionCandidateType,
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

enum SessionState {
  Initializing,
  Initiated,
  Waiting,
  InLobby,
  Admitting,
  Connected,
}

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.less'],
  animations: [appModuleAnimation()],
})
export class SessionsComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild('localVideoEl', { static: true }) localVideoEl: ElementRef;
  @ViewChild('remoteVideoEl', { static: true }) remoteVideoEl: ElementRef;

  SessionState = SessionState;

  calendarEvent: CalendarEventDto = new CalendarEventDto;
  calendarEventId: string;
  sessionState = SessionState.Initializing;
  peerConnection: RTCPeerConnection;
  localStream: MediaStream;
  remoteStream: MediaStream;
  localVideo: HTMLVideoElement;
  remoteVideo: HTMLVideoElement;
  meetingsHub: any;
  otherUser: UserDto;
  isAudioEnabled = true;
  isVideoEnabled = true;
  isLoading = false;

  constructor(
    injector: Injector,
    private _activatedRoute: ActivatedRoute,
    private _sessionsService: SessionsServiceProxy,
    private _profilesService: ProfilesServiceProxy,
    private _calendarEventsService: CalendarEventsServiceProxy,
  ) {
    super(injector);
    this._activatedRoute.paramMap.subscribe(paramMap => {
      this.calendarEventId = paramMap.get('calendar-event-id');
    });
  }

  public get isRemoteLoading(): boolean {
    return this.sessionState !== SessionState.Waiting
      && this.sessionState !== SessionState.InLobby
      && this.sessionState !== SessionState.Connected;
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    await this.initializeWebRTC();
    await this.initializeHub();
  }

  ngAfterViewInit(): void {
    this.localVideo = this.localVideoEl.nativeElement;
    this.remoteVideo = this.remoteVideoEl.nativeElement;
  }

  async initializeWebRTC(): Promise<void> {
    const creds = await this._sessionsService.getConfiguration().toPromise();
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
          username: creds.username,
          credential: creds.password,
        },
      ],
      iceTransportPolicy: 'all',
      iceCandidatePoolSize: 10,
    });
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
    this.sessionState = SessionState.Initiated;
  }

  async onAdmitClick(): Promise<void> {
    this.sessionState = SessionState.Admitting;

    this.meetingsHub.invoke('admittingStudent', [this.otherUser.id]);
    console.log('invoke - admittingStudent');

    const session = await this._sessionsService.get(this.calendarEventId).toPromise();
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

        this.meetingsHub.invoke('establishConnection', [this.otherUser.id, this.appSession.userId]);
        console.log('invoke - establishConnection');
      }
    }
  }

  onMuteAudioClick(): void {
    this.isAudioEnabled = !this.isAudioEnabled;
    this.localStream.getAudioTracks().forEach(track => track.enabled = this.isAudioEnabled);
  }

  onMuteVideoClick(): void {
    this.isVideoEnabled = !this.isVideoEnabled;
    this.localStream.getVideoTracks().forEach(track => track.enabled = this.isVideoEnabled);
  }

  onHangupClick(): void {

  }

  private async initializeHub(): Promise<void> {
    jQuery.getScript(AppConsts.appBaseUrl + '/assets/abp/abp.signalr-client.js', async () => {
      await abp.signalr.startConnection(abp.appPath + 'signalr-sessionsHub', (connection: any) => {
        this.meetingsHub = connection;

        connection.on('startSession', async () => {
          console.log('startSession');
          if (this.otherUser) {
            this.meetingsHub.invoke('connectStudent', [this.otherUser.id]);
            console.log('invoke - connectStudent');
          }
        });

        connection.on('joinSession', async () => {
          console.log('joinSession');
          if (this.sessionState === SessionState.Waiting) {
            await this.joinSession();
            this.sessionState = SessionState.InLobby;
          }
        });

        connection.on('admitStudent', async () => {
          console.log('admitStudent');
          this.sessionState = SessionState.InLobby;
        });

        connection.on('waitForAdmission', async () => {
          console.log('waitForAdmission');
          this.sessionState = SessionState.Admitting;
        });

        connection.on('connectionEstablished', async () => {
          console.log('connectionEstablished');
          this.sessionState = SessionState.Connected;
        });
      });

      this.calendarEvent = await this._calendarEventsService.get(this.calendarEventId).toPromise();
      const userCalendarEvent = _.first(_.filter(this.calendarEvent.userCalendarEvents, e => e.userId !== this.appSession.userId));

      await this.initializeDevice();

      this.otherUser = await this._profilesService.get(userCalendarEvent.userId).toPromise();
      this.sessionState = SessionState.Waiting;

      if (this.isTutor) {
        await this.startSession();
      } else {
        this.meetingsHub.invoke('studentJoined', [this.otherUser.id]);
        console.log('invoke - studentJoined');
      }

      this.isLoading = false;
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
        await this._sessionsService.createCandidate(sessionCandidate).toPromise();
      }
    };

    const offerDescription = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offerDescription);

    session.offer = JSON.stringify(offerDescription);
    await this._sessionsService.update(session).toPromise();

    this.meetingsHub.invoke('connectStudent', [this.otherUser.id]);
    console.log('invoke - connectStudent');
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
        await this._sessionsService.createCandidate(sessionCandidate).toPromise();
      }
    };

    const offer = JSON.parse(session.offer);
    await this.peerConnection.setRemoteDescription(offer);

    const answerDescription = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answerDescription);

    session.answer = JSON.stringify(answerDescription);
    await this._sessionsService.update(session).toPromise();

    this.meetingsHub.invoke('studentConnected', [this.otherUser.id]);
    console.log('invoke - studentConnected');
  }
}
