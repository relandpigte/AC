import { Component, OnInit, Injector, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ConferenceService } from '@app/_shared/services/conference.service';
import { EventSessionsServiceProxy, EventUserDto, EventUserType } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import * as rtc from 'rtc-lib';
import { HubService } from '@app/_shared/services/hub.service';

@Component({
  selector: 'app-broadcast-session',
  templateUrl: './broadcast-session.component.html',
  styleUrls: ['./broadcast-session.component.less']
})
export class BroadcastSessionComponent extends AppComponentBase implements OnInit, AfterViewInit {
  eventId: string;
  hostUser = new EventUserDto();
  eventUser = new EventUserDto();
  allEventUsers: EventUserDto[] = [];
  eventUsers: EventUserDto[] = [];
  room: rtc.Room;

  @ViewChildren('videos') private videos: QueryList<ElementRef>;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    // private _conferenceService: ConferenceService,
    private _hubService: HubService,
    private _eventSessionsService: EventSessionsServiceProxy,
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('event-id')) {
        this.eventId = paramMap.get('event-id');
      }
    });
  }

  get isHost(): boolean {
    return this.eventUser.user.id === this.hostUser.user.id;
  }

  async ngOnInit(): Promise<void> {
    this.getEventUsers();

    // this._conferenceService.userJoined
    //   .pipe(takeUntil(this.destroyed$))
    //   .subscribe(response => {
    //     console.log('userJoined');
    //     console.log(response);
    //     const joiningUser = this.allEventUsers.find(e => e.user.id === response.id);
    //     this.eventUsers.push(joiningUser);
    //     console.log('eventUsers');
    //     console.log(this.eventUsers);
    //   });
  }

  async ngAfterViewInit(): Promise<void> {
    this.videos.changes.subscribe(async (val: any) => {
      const currentEl = this.videos.last.nativeElement;
      const userId: number = +currentEl.id;
      if (userId === this.eventUser.user.id) {
        const stream = this.room.local.addStream({ video: true, audio: true });
        const ve = new rtc.MediaDomElement(currentEl, stream);
        console.log('trying to connect to room');
        await this.room.connect();
        console.log('connected to room');
        // await this._conferenceService.initDevice(this.eventUser.user.id, currentEl);
      } else {
        const firstEl = this.videos.first.nativeElement;
        // await this._conferenceService.initOtherDevice(this.eventUser.user.id, currentEl);
        // await this._conferenceService.createOffers(this.eventUser.user.id, [userId]);
      }
    });
  }

  private async getEventUsers(): Promise<void> {
    console.log('getting event users');
    this._eventSessionsService.getUsers(this.eventId)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(async responses => {
        console.log(responses);
        this.allEventUsers = responses;
        this.hostUser = this.allEventUsers.find(e => e.type === EventUserType.Host);
        this.eventUser = this.allEventUsers.find(e => e.user.id === this.appSession.userId);
        console.log(this.videos);
        await this.initHub();
      });
  }

  private async initHub(): Promise<void> {
    console.log('initializing hub');
    this._hubService.getEventSessionsHub({ 'userId': this.appSession.userId }, async (conn) => {
      console.log(conn);
      // const ws = conn.connection.baseUrl.replace('http', 'ws').replace('https', 'ws');
      const ws = 'wss://easy.innovailable.eu/' + encodeURI(this.eventId);
      console.log(ws);
      const channel = new rtc.WebSocketChannel(ws);
      const signaling = new rtc.MucSignaling(channel);
      const options = {
        stun: 'stun:stun.innovailable.eu',
      };
      this.room = new rtc.Room(signaling, options);

      this.room.on('peer_joined', (peer) => {
        console.log('peer joined');
        // create a video tag for the peer
        const view = $('<video autoplay>');
        $('#peers').append(view);
        const ve = new rtc.MediaDomElement(view[0] as any, peer);

        // remove the tag after peer left
        peer.on('left', function () {
          view.remove();
        });
      });
      this.eventUsers.push(this.eventUser);
    });
    // await this._conferenceService.initHub(async () => {
    //   let userIds: number[] = [];
    //   if (this.isHost) {
    //     userIds = this.allEventUsers.map(e => e.user.id).filter(id => id !== this.eventUser.user.id);
    //   } else {
    //     userIds = [this.hostUser.user.id];
    //   }
    //   await this._conferenceService.joinConference(userIds, this.eventUser.user);
    //   await this._conferenceService.initWebRTC(this.eventUser.user.id);
    //   this.eventUsers.push(this.eventUser);
    // });
  }
}
