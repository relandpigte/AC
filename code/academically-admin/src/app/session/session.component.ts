import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AgoraClient, ClientEvent, NgxAgoraService, Stream, StreamEvent, } from 'ngx-agora';
import { environment } from 'environments/environment';
import { UserSessionsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.less'],
})
export class SessionComponent extends AppComponentBase implements OnInit {
  localCallId = 'agora_local';
  remoteCalls: string[] = [];
  uid: number;
  channelName: string;
  channelToken: string;

  private client: AgoraClient;
  private localStream: Stream;

  constructor(
    injector: Injector,
    private _agoraService: NgxAgoraService,
    private _sessionsService: UserSessionsServiceProxy,
  ) {
    super(injector);
    this.uid = this.appSession.userId;

    this.channelName = `test-vc`;
    const expirationInSeconds = 3600;
    const currentTimestamp = Math.floor(new Date(2020, 12, 9, 13, 0, 0, 0).getMilliseconds() / 1000);
    const totalExpirationTimestamp = currentTimestamp + expirationInSeconds;
    console.log(this.channelToken);
  }

  ngOnInit(): void {
    this.client = this._agoraService.createClient({ mode: 'rtc', codec: 'h264' });
    this.assignClientHandlers();

    // Added in this step to initialize the local A/V stream
    this.localStream = this._agoraService.createStream({ streamID: this.uid, audio: true, video: true, screen: false });
    this.assignLocalStreamHandlers();
    // Join and publish methods added in this step

    this._sessionsService.join('c2f14e2f-8c82-494e-bfb5-29eab07c08b2').subscribe(joinSessionResult => {
      this.initLocalStream(() => this.join("vc-test", joinSessionResult.channelToken, uid => this.publish(), error => console.error(error)));
    });
  }

  /**
 * Attempts to connect to an online chat room where users can host and receive A/V streams.
 */
  join(channelName: string, channelToken: string, onSuccess?: (uid: number | string) => void, onFailure?: (error: Error) => void): void {
    this.client.join(channelToken, channelName, this.uid, onSuccess, onFailure);
  }

  /**
   * Attempts to upload the created local A/V stream to a joined chat room.
   */
  publish(): void {
    this.client.publish(this.localStream, err => console.log('Publish local stream error: ' + err));
  }

  private assignClientHandlers(): void {
    this.client.on(ClientEvent.LocalStreamPublished, (evt) => {
      console.log('Publish local stream successfully');
    });

    this.client.on(ClientEvent.Error, (error) => {
      console.log('Got error msg:', error.reason);
      if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.client.renewChannelKey(
          '',
          () => console.log('Renewed the channel key successfully.'),
          (renewError) => console.error('Renew channel key failed: ', renewError)
        );
      }
    });

    this.client.on(ClientEvent.RemoteStreamAdded, (evt) => {
      const stream = evt.stream as Stream;
      this.client.subscribe(stream, { audio: true, video: true }, (err) => {
        console.log('Subscribe stream failed', err);
      });
    });

    this.client.on(ClientEvent.RemoteStreamSubscribed, (evt) => {
      const stream = evt.stream as Stream;
      const id = this.getRemoteId(stream);
      if (!this.remoteCalls.length) {
        this.remoteCalls.push(id);
        setTimeout(() => stream.play(id), 1000);
      }
    });

    this.client.on(ClientEvent.RemoteStreamRemoved, (evt) => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = [];
        console.log(`Remote stream is removed ${stream.getId()}`);
      }
    });

    this.client.on(ClientEvent.PeerLeave, (evt) => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter((call) => call !== `${this.getRemoteId(stream)}`);
        console.log(`${evt.uid} left from this channel`);
      }
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
