import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Injector } from '@angular/core';
import {
  SessionsServiceProxy,
  SessionCandidateDto,
  SessionCandidateType,
  ProfilesServiceProxy,
  CalendarEventsServiceProxy,
  UserDto,
  CalendarEventDto,
  UserLoginInfoDto,
} from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { Subscription, interval } from 'rxjs';
import * as moment from 'moment';
import { NumberSymbol } from '@angular/common';

enum SessionState {
  Initializing,
  Initiated,
  ConnectStudent,
  Waiting,
  InLobby,
  Admitting,
  Connected,
}

enum StreamTrackType {
  Audio = 'audio',
  Video = 'video',
}

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.less'],
  animations: [appModuleAnimation()],
})
export class SessionsComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild('presenterVideoEl', { static: true }) presenterVideoEl: ElementRef;
  @ViewChild('localVideoEl', { static: true }) localVideoEl: ElementRef;
  @ViewChild('remoteVideoEl', { static: true }) remoteVideoEl: ElementRef;

  SessionState = SessionState;

  calendarEvent: CalendarEventDto = new CalendarEventDto;
  calendarEventId: string;
  sessionState = SessionState.Initializing;
  peerConnection: RTCPeerConnection;
  presenterStream: MediaStream;
  remoteStream: MediaStream;
  presenterVideo: HTMLVideoElement;
  remoteVideo: HTMLVideoElement;
  localVideo: HTMLVideoElement;
  presenterSender: RTCRtpSender;
  meetingsHub: any;
  otherUser: UserDto;
  sessionTimerSubscription: Subscription;
  sessionTimerSeconds = -1;
  isAudioEnabled = true;
  isVideoEnabled = true;
  isScreenSharing = false;
  isRemoteScreenSharing = false;
  isRemoteAudioEnabled = false;
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

  public get sessionTimer(): string {
    const minutes = Math.floor(this.sessionTimerSeconds / 60);
    const seconds = this.sessionTimerSeconds % 60;
    return this.strPadLeft(minutes, 2) + ':' + this.strPadLeft(seconds, 2);
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    await this.initializeWebRTC();
    await this.initializeHub();
  }

  ngAfterViewInit(): void {
    this.presenterVideo = this.presenterVideoEl.nativeElement;
    this.remoteVideo = this.remoteVideoEl.nativeElement;
    this.localVideo = this.localVideoEl.nativeElement;
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
          username: 'CJL8kokGEgZ9eARpCUwYqvGggqMKIICjBTAK',
          credential: 'DyyYyerG+RbPOlWQg3El0vJTaCY=',
        },
      ],
      iceTransportPolicy: 'all',
      iceCandidatePoolSize: 10,
    });
  }

  async initializeDevice(): Promise<void> {
    this.presenterStream = await navigator.mediaDevices.getUserMedia({
      video: true,
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
    this.remoteStream = new MediaStream();

    this.presenterStream.getTracks().forEach(track => {
      switch (track.kind) {
        case StreamTrackType.Audio:
          track.enabled = this.isAudioEnabled;
          this.peerConnection.addTrack(track, this.presenterStream);
          break;
        case StreamTrackType.Video:
          track.enabled = this.isVideoEnabled;
          this.presenterSender = this.peerConnection.addTrack(track, this.presenterStream);
          break;
      }
    });

    this.peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        this.remoteStream.addTrack(track);
      });
    };

    this.presenterVideo.srcObject = this.presenterStream;
    this.presenterVideo.volume = 0;
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

        const duration = moment.duration(this.calendarEvent.endTime.diff(this.calendarEvent.startTime)).asSeconds();

        this.meetingsHub.invoke('establishConnection', duration, [this.otherUser.id, this.appSession.userId]);
        console.log('invoke - establishConnection');
      }
    }
  }

  onMuteAudioClick(): void {
    this.isAudioEnabled = !this.isAudioEnabled;
    this.presenterStream.getAudioTracks().forEach(track => track.enabled = this.isAudioEnabled);
    this.meetingsHub.invoke('toggleAudio', this.isAudioEnabled, [this.otherUser.id]);
  }

  onMuteVideoClick(): void {
    this.isVideoEnabled = !this.isVideoEnabled;
    this.presenterStream.getVideoTracks().forEach(track => track.enabled = this.isVideoEnabled);
  }

  async onShareScreenClick(): Promise<void> {
    if (!this.isScreenSharing) {
      // @ts-ignore
      const shareScreenStream: MediaStream = await navigator.mediaDevices.getDisplayMedia();
      const shareScreenTrack = shareScreenStream.getTracks()[0];
      this.presenterSender.replaceTrack(shareScreenTrack);
      this.presenterVideo.srcObject = shareScreenStream;
      this.localVideo.srcObject = this.presenterStream;
      this.isScreenSharing = true;

      this.meetingsHub.invoke('shareScreen', this.appSession.userId, [this.otherUser.id]);
      console.log('invoke - shareScreen');
    } else {
      const localVideoStream: MediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const localVideoTrack = localVideoStream.getTracks().find(e => e.kind === StreamTrackType.Video);
      this.presenterSender.replaceTrack(localVideoTrack);
      this.presenterVideo.srcObject = localVideoStream;
      this.isScreenSharing = false;

      this.meetingsHub.invoke('stopScreenShare', this.appSession.userId, [this.otherUser.id]);
      console.log('invoke - stopScreenShare');
    }
  }

  onHangupClick(): void {
    this.disconnectTrack(this.presenterStream);
    this.disconnectTrack(this.remoteStream);
    window.close();
  }

  private async initializeHub(): Promise<void> {
    jQuery.getScript(AppConsts.appBaseUrl + '/assets/abp/abp.signalr-client.js', async () => {
      await abp.signalr.startConnection(abp.appPath + 'signalr-sessionsHub', (connection: any) => {
        this.meetingsHub = connection;

        connection.on('startSession', async () => {
          console.log('startSession');
          if (this.otherUser && this.sessionState !== SessionState.ConnectStudent) {
            this.meetingsHub.invoke('connectStudent', [this.otherUser.id]);
            this.sessionState = SessionState.ConnectStudent;
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

        connection.on('connectionEstablished', async (durationInSeconds: number) => {
          console.log('connectionEstablished');
          this.sessionState = SessionState.Connected;
          this.sessionTimerSeconds = durationInSeconds;
          await this.startSessionTimer();
          this.isRemoteAudioEnabled = true;
        });

        connection.on('audioToggled', async (isEnabled: boolean) => {
          console.log('audioToggled');
          this.isRemoteAudioEnabled = isEnabled;
        });

        connection.on('screenShared', async (presenterUserId: NumberSymbol) => {
          console.log('screenShared');
          if (presenterUserId !== this.appSession.userId) {
            this.presenterVideo.srcObject = this.remoteStream;
            this.localVideo.srcObject = this.presenterStream;
            this.isScreenSharing = true;
            this.isRemoteScreenSharing = true;
          }
        });

        connection.on('screenShareStopped', async (presenterUserId: NumberSymbol) => {
          console.log('screenShareStopped');
          if (presenterUserId !== this.appSession.userId) {
            this.presenterVideo.srcObject = this.presenterStream;
            this.isScreenSharing = false;
            this.isRemoteScreenSharing = false;
          }
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

    if (this.sessionState !== SessionState.ConnectStudent) {
      this.meetingsHub.invoke('connectStudent', [this.otherUser.id]);
      console.log('invoke - connectStudent');
    }
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

  private async startSessionTimer(): Promise<void> {
    this.sessionTimerSubscription = interval(1000).subscribe(() => {
      if (this.sessionTimerSeconds > 1) {
        this.sessionTimerSeconds--;
      } else {
        this.sessionTimerSeconds = 0;
        this.sessionTimerSubscription.unsubscribe();
        this.disconnectTrack(this.presenterStream);
        this.disconnectTrack(this.remoteStream);
        this.message.confirm('', this.l('SessionEndedMessage'), (result) => {
          if (result) {
            window.close();
          }
        }, {
          confirmButtonText: this.l('Okay'),
          showCancelButton: false,
        });
      }
    });
  }

  private disconnectTrack(stream: MediaStream): void {
    stream.getAudioTracks().forEach(track => {
      track.enabled = false;
      setTimeout(() => {
        stream.removeTrack(track);
      }, 500);
    });
    stream.getVideoTracks().forEach(track => {
      track.enabled = false;
      setTimeout(() => {
        stream.removeTrack(track);
      }, 500);
    });
  }
}
