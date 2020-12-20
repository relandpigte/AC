import { EventEmitter, Injectable } from '@angular/core';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoConferenceService {
  remoteCallUpdate = new EventEmitter<boolean>(false);
  remoteVideoToggle = new EventEmitter<boolean>(false);
  private localCallId: string;
  private remoteCallId: string;
  private uid: number;
  private agoraClient: IAgoraRTCClient;
  private localAudioTrack: IMicrophoneAudioTrack;
  private localVideoTrack: ICameraVideoTrack;

  constructor(
  ) { }

  public initialize(uid: number, localCallId: string, remoteCallId: string): void {
    this.uid = uid;
    this.localCallId = localCallId;
    this.remoteCallId = remoteCallId;
    this.agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  }

  public async join(channelName: string, channelToken: string, isVideoEnabled: boolean, isAudioEnabled: boolean): Promise<void> {
    await this.agoraClient.join(environment.agora.appId, channelName, channelToken, this.uid);
    await this.initEvents();
    await this.publishLocalTracks().then(() => {
      this.initUserMedia(isVideoEnabled, isAudioEnabled);
    });
  }

  public async leave(): Promise<void> {
    if (this.localVideoTrack.isPlaying) {
      this.localVideoTrack.close();
    }
    if (this.localAudioTrack.isPlaying) {
      this.localAudioTrack.close();
    }
    await this.agoraClient.leave();
  }

  public async toggleVideo(isEnabled: boolean): Promise<void> {
    this.localVideoTrack.setEnabled(isEnabled);
  }

  public async toggleAudio(isEnabled: boolean): Promise<void> {
    this.localAudioTrack.setEnabled(isEnabled);
  }

  private async publishLocalTracks(): Promise<void> {
    this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    this.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    await this.agoraClient.publish([this.localAudioTrack, this.localVideoTrack]);
  };

  private async initEvents(): Promise<void> {
    this.agoraClient.on('user-joined', async (user) => {
      this.remoteCallUpdate.next(true);
    });
    this.agoraClient.on('user-left', async (user) => {
      this.remoteCallUpdate.next(false);
    });

    this.agoraClient.on('user-published', async (user, mediaType) => {
      await this.agoraClient.subscribe(user, mediaType);

      if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack;
        remoteVideoTrack.play(this.remoteCallId);
        this.remoteVideoToggle.next(true);
      }

      if (mediaType === 'audio') {
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack.play();
      }
    });

    this.agoraClient.on('user-unpublished', async (user, mediaType) => {
      await this.agoraClient.unsubscribe(user, mediaType);

      if (mediaType === 'video') {
        this.remoteVideoToggle.next(false);
      }
    });
  }

  private initUserMedia(isVideoEnabled: boolean, isAudioEnabled: boolean): void {
    if (!isVideoEnabled) {
      this.localVideoTrack.setEnabled(false);
    }
    if (!isAudioEnabled) {
      this.localAudioTrack.setEnabled(false);
    }
    this.localVideoTrack.play(this.localCallId);
    this.localAudioTrack.play();
  }
}
