import { EventEmitter, Injectable, Injector, OnDestroy } from '@angular/core';
import { AppHubBase, SignalData } from '@shared/app-hub-base';
import { UserDto } from '@shared/service-proxies/service-proxies';
import { environment } from 'environments/environment';
import { HubService } from './hub.service';

enum StreamTrackType {
  Audio = 'audio',
  Video = 'video',
}

const EVENT_SESSIONS_HUB_NAME = 'eventSessionsHub';

@Injectable({
  providedIn: 'root'
})
export class ConferenceService extends AppHubBase implements OnDestroy {
  public userJoined = new EventEmitter<UserDto>();
  public conferenceUsers: UserDto[] = [];

  private peerConnections: RTCPeerConnection[] = [];

  constructor(
    private _hubService: HubService,
  ) {
    super();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  async initHub(callback?: () => void): Promise<void> {
    this.addHub(EVENT_SESSIONS_HUB_NAME, await this._hubService.getEventSessionsHub(async () => {
      if (callback) {
        callback();
      }

      this.receiveSignal(EVENT_SESSIONS_HUB_NAME, async (sSignalData: string) => {
        const signalData = new SignalData();
        Object.assign(signalData, JSON.parse(sSignalData));

        console.log('handling receiveSignal');
        console.log(sSignalData);

        switch (signalData.action) {

          case 'userJoined':
            console.log('receieveSignal - userJoined');
            const user = JSON.parse(signalData.data) as UserDto;
            this.userJoined.emit(user);
            console.log('userJoined emitted');
            break;

          case 'ice-candidate':
            console.log('receieveSignal - ice-candidate');
            const iceData = JSON.parse(signalData.data);
            await this.peerConnections[0].addIceCandidate(iceData);
            break;

          case 'offer':
            console.log('receieveSignal - offer');
            const offer = JSON.parse(signalData.data);
            this.userJoined.emit(user);
            break;

        }
      });
    }));
  }

  async initWebRTC(index: number): Promise<void> {
    console.log('initWebRTC');
    this.peerConnections[index] = new RTCPeerConnection({
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

  async initDevice(peerId: number, videoEl: HTMLVideoElement): Promise<void> {
    console.log('initDevice:' + peerId);
    const videoStream = await navigator.mediaDevices.getUserMedia({
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
    videoStream.getTracks().forEach(track => {
      switch (track.kind) {
        case StreamTrackType.Audio:
          this.peerConnections[peerId].addTrack(track, videoStream);
          break;
        case StreamTrackType.Video:
          this.peerConnections[peerId].addTrack(track, videoStream);
          break;
      }
    });
    videoEl.srcObject = videoStream;
    videoEl.volume = 0;
    videoEl.muted = true;

    // this.attendeeStream = new MediaStream();
    // this.peerConnections[peerId].ontrack = (event) => {
    //   event.streams[0].getTracks().forEach(track => {
    //     this.attendeeStream.addTrack(track);
    //   });
    // };
    // this.attendeeVideo.srcObject = this.attendeeStream;
  }

  async initOtherDevice(peerId: number, videoEl: HTMLVideoElement): Promise<void> {
    console.log('initOtherDevice:' + peerId);
    const videoStream = new MediaStream();
    this.peerConnections[peerId].ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        videoStream.addTrack(track);
      });
    };
    videoEl.srcObject = videoStream;
  }

  async joinConference(userIds: number[], user: UserDto): Promise<void> {
    console.log('joinConference');
    const signalData = new SignalData('userJoined', JSON.stringify(user));
    this.conferenceUsers.push(user);
    await this.sendSignal(EVENT_SESSIONS_HUB_NAME, userIds, signalData);
  }

  async createOffers(peerId: number, userIds: number[]): Promise<void> {
    this.peerConnections[peerId].onicecandidate = async (event) => {
      console.log(event.candidate);
      if (event && event.candidate) {
        const iceData = new SignalData('ice-candidate', JSON.stringify(event.candidate.toJSON()));
        await this.sendSignal(EVENT_SESSIONS_HUB_NAME, userIds, iceData);
      }
    };

    const offerDescription = await this.peerConnections[peerId].createOffer();
    await this.peerConnections[peerId].setLocalDescription(offerDescription);
    const signalData = new SignalData('offer', JSON.stringify(offerDescription));
    await this.sendSignal(EVENT_SESSIONS_HUB_NAME, userIds, signalData);
  }
}
