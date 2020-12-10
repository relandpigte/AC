import { EventEmitter, Injectable } from '@angular/core';
import { AgoraClient, ClientEvent, NgxAgoraService, Stream, StreamEvent } from 'ngx-agora';

@Injectable({
  providedIn: 'root'
})
export class VideoConferenceService {
  remoteCallsUpdate = new EventEmitter<string[]>();
  remoteVideoToggle = new EventEmitter<boolean>(false);
  remoteAudioToggle = new EventEmitter<boolean>(false);
  localCallId: string;
  uid: number;
  remoteCalls: string[] = [];
  channelName: string;
  channelToken: string;

  private agoraClient: AgoraClient;
  private localStream: Stream;

  constructor(
    private _agoraService: NgxAgoraService
  ) { }

  public initialize(uid, localCallId): void {
    this.uid = uid;
    this.localCallId = localCallId;

    this.agoraClient = this._agoraService.createClient({ mode: 'rtc', codec: 'h264' });
    this.assignClientHandlers();

    this.localStream = this._agoraService.createStream({ streamID: this.uid, audio: true, video: true, screen: false });
    this.assignLocalStreamHandlers();
  }

  public join(channelName: string, channelToken: string): void {
    this.initLocalStream(() => this.connect(channelName, channelToken, uid => this.publish(), error => console.error(error)));
  }

  public leave(): void {
    this.agoraClient.leave();
    this.localStream.close();
  }

  public toggleVideo(isEnabled: boolean) {
    isEnabled ? this.localStream.unmuteVideo() : this.localStream.muteVideo();
  }

  public toggleAudio(isEnabled: boolean) {
    isEnabled ? this.localStream.unmuteAudio() : this.localStream.muteAudio();
  }

  /**
   * Attempts to connect to an online chat room where users can host and receive A/V streams.
   */
  private connect(channelName: string, channelToken: string, onSuccess?: (uid: number | string) => void, onFailure?: (error: Error) => void): void {
    this.agoraClient.join(channelToken, channelName, this.uid, onSuccess, onFailure);
  }

  /**
   * Attempts to upload the created local A/V stream to a joined chat room.
   */
  private publish(): void {
    this.agoraClient.publish(this.localStream, err => console.log('Publish local stream error: ' + err));
  }

  private assignClientHandlers(): void {
    this.agoraClient.on(ClientEvent.LocalStreamPublished, (evt) => {
      console.log('Publish local stream successfully');
    });

    this.agoraClient.on(ClientEvent.Error, (error) => {
      console.log('Got error msg:', error.reason);
      if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.agoraClient.renewChannelKey(
          '',
          () => console.log('Renewed the channel key successfully.'),
          (renewError) => console.error('Renew channel key failed: ', renewError)
        );
      }
    });

    this.agoraClient.on(ClientEvent.RemoteStreamAdded, (evt) => {
      const stream = evt.stream as Stream;
      this.agoraClient.subscribe(stream, { audio: true, video: true }, (err) => {
        console.log('Subscribe stream failed', err);
      });
    });

    this.agoraClient.on(ClientEvent.RemoteStreamSubscribed, (evt) => {
      const stream = evt.stream as Stream;
      const id = this.getRemoteId(stream);
      if (!this.remoteCalls.length) {
        this.remoteCalls.push(id);
        this.remoteCallsUpdate.next(this.remoteCalls);
        setTimeout(() => stream.play(id), 1000);
      }
    });

    this.agoraClient.on(ClientEvent.RemoteStreamRemoved, (evt) => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = [];
        this.remoteCallsUpdate.next(this.remoteCalls);
        console.log(`Remote stream is removed ${stream.getId()}`);
      }
    });

    this.agoraClient.on(ClientEvent.PeerLeave, (evt) => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter((call) => call !== `${this.getRemoteId(stream)}`);
        this.remoteCallsUpdate.next(this.remoteCalls);
        console.log(`${evt.uid} left from this channel`);
      }
    });

    this.agoraClient.on(ClientEvent.RemoveVideoMuted, (evt) => {
      console.log('Video Muted: ' + evt.uid);
      this.remoteVideoToggle.next(false);
    });

    this.agoraClient.on(ClientEvent.RemoteVideoUnmuted, (evt) => {
      console.log('Video Unmuted: ' + evt.uid);
      this.remoteVideoToggle.next(true);
    });

    this.agoraClient.on(ClientEvent.RemoteAudioMuted, (evt) => {
      console.log('Audio Muted: ' + evt.uid);
      this.remoteAudioToggle.next(false);
    });

    this.agoraClient.on(ClientEvent.RemoteAudioUnmuted, (evt) => {
      console.log('Audio Unmuted: ' + evt.uid);
      this.remoteAudioToggle.next(true);
    });
  }

  private assignLocalStreamHandlers(): void {
    this.localStream.on(StreamEvent.MediaAccessAllowed, () => {
      console.log('accessAllowed');
    });

    // The user has denied access to the camera and mic.
    this.localStream.on(StreamEvent.MediaAccessDenied, () => {
      console.log('accessDenied');
    });
  }

  private initLocalStream(onSuccess?: () => any): void {
    this.localStream.init(
      () => {
        // The user has granted access to the camera and mic.
        this.localStream.muteVideo();
        this.localStream.play(this.localCallId);
        if (onSuccess) {
          onSuccess();
        }
      },
      err => console.error('getUserMedia failed', err)
    );
  }

  private getRemoteId(stream: Stream): string {
    return `agora_remote-${stream.getId()}`;
  }
}
