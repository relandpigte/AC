import { Injectable, EventEmitter, ElementRef } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import { HubService } from './hub.service';
import { UserDto } from '@shared/service-proxies/service-proxies';
import { environment } from 'environments/environment';

enum StreamTrackType {
  Audio = 'audio',
  Video = 'video',
}

class SignalData {
  action: string;
  data: string;

  constructor(action: string, data: string) {
    this.action = action;
    this.data = data;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ConferenceService {
  public userJoined = new EventEmitter<UserDto>();
  public conferenceUsers: UserDto[] = [];

  private eventSessionsHub: HubConnection;
  private peerConnections: RTCPeerConnection[] = [];

  constructor(
    private _hubService: HubService,
  ) { }

  async initHub(callback?: () => void): Promise<void> {
    this.eventSessionsHub = await this._hubService.getEventSessionsHub(async () => {
      if (callback) {
        callback();
      }

      console.log('initHub callback');
      this.eventSessionsHub.on('receiveSignal', async (sSignalData: string) => {
        const signalData = JSON.parse(sSignalData) as SignalData;
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
    });
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

  async sendSignal<TObject>(userIds: number[], signalData: SignalData, callback?: () => void): Promise<void> {
    console.log('invoking sendSignal');
    console.log(userIds);
    console.log(signalData);
    const sSignalData = JSON.stringify(signalData);
    await this.eventSessionsHub.invoke('sendSignal', userIds, sSignalData)
      .then(() => {
        if (callback) {
          callback();
        }
      });
  }

  async joinConference(userIds: number[], user: UserDto): Promise<void> {
    console.log('joinConference');
    const signalData = new SignalData('userJoined', JSON.stringify(user));
    this.conferenceUsers.push(user);
    this.sendSignal(userIds, signalData);
  }

  async createOffers(peerId: number, userIds: number[]): Promise<void> {
    this.peerConnections[peerId].onicecandidate = async (event) => {
      console.log(event.candidate);
      if (event && event.candidate) {
        const iceData = new SignalData('ice-candidate', JSON.stringify(event.candidate.toJSON()));
        await this.sendSignal(userIds, iceData);
      }
    };

    const offerDescription = await this.peerConnections[peerId].createOffer();
    await this.peerConnections[peerId].setLocalDescription(offerDescription);
    const signalData = new SignalData('offer', JSON.stringify(offerDescription));
    await this.sendSignal(userIds, signalData);
  }
}
