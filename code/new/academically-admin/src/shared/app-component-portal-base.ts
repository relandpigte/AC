import { ElementRef, Injectable, Injector, OnDestroy, OnInit, QueryList } from '@angular/core';
import { HubService } from '@app/_shared/services/hub.service';
import { SelectedMachineDevice } from '@app/dashboard/events/portal/broadcast/student/portal/_components/device-settings/device-settings.component';
import { PortalService } from '@app/dashboard/events/portal/broadcast/student/portal/_services/portal.service';
import * as rtc from 'rtc-lib';
import { AppComponentBase } from './app-component-base';
import { SignalData } from './app-hub-base';
import { EventDto, EventUserDto, EventUserType, EventsServiceProxy } from './service-proxies/service-proxies';
import { ModalDialogOptions, ModalDialogService } from './services/modal-dialog.service';

export interface PortalViewElementsProperties {
    presenterVideoEl: ElementRef;
    attendeeVideosEl: QueryList<ElementRef>;
}

export interface PeerLeaveProperties {
    peer: rtc.RemotePeer;
    videoEl: ElementRef;
}

export enum ConferenceAction {
    StartEvent,
    JoinEvent,
    EndEvent,
    GuestJoined,
    AutoAdmitChange,
    AdmitGuest,
    LobbyEntered,
    PingHost,
}

export const EVENT_SESSIONS_HUB_NAME = 'eventSessionsHub';

@Injectable()
export abstract class AppComponentPortalBase extends AppComponentBase implements OnInit, OnDestroy {
    _hubService: HubService;
    _portalService: PortalService;
    _modalDialogService: ModalDialogService;
    _eventsService: EventsServiceProxy;

    viewProps: PortalViewElementsProperties;

    room: rtc.Room;

    selectedMachineDevice: SelectedMachineDevice;

    eventId: string;
    eventModel = new EventDto;

    eventHost = new EventUserDto();
    eventUser = new EventUserDto();
    allEventUsers: EventUserDto[] = [];
    joiningEventUsers: EventUserDto[] = [];
    attendees: EventUserDto[] = [];

    hubConnected = false;
    eventStarting = false;
    eventStarted = false;
    eventJoined = false;
    inLobby = false;
    showDeviceSettings = true;
    requestToSpeakDisabled = false;
    sharingWhiteboard = false;
    waiting = false;

    constructor(
        injector: Injector
    ) {
        super(injector);
        this._hubService = injector.get(HubService);
        this._portalService = injector.get(PortalService);
        this._modalDialogService = injector.get(ModalDialogService);
        this._eventsService = injector.get(EventsServiceProxy);
    }

    get eventHostUserId(): number { return this.eventHost.user.id; }
    get otherEventUserIds(): number[] { return this.allEventUsers.filter(e => e.user.id !== this.eventUser.user.id).map(e => e.user.id); }
    get isHost(): boolean { return this.eventModel.creatorUserId === this.appSession.userId; }

    async ngOnInit() {
        this.subscribeToPortalEvents();
        await this.initHub();
    }

    initPortalViewProperties(viewProps: PortalViewElementsProperties) {
        this.viewProps = viewProps;
        this.viewProps.attendeeVideosEl?.changes.subscribe(async (val: any) => {
            if (this.viewProps.attendeeVideosEl.length && !this.eventStarted) {
                const currentEl = this.viewProps.attendeeVideosEl.last.nativeElement;
                await this.initDevice(currentEl);
            }
        });
    }

    subscribeToPortalEvents() {
        // admissions
        this.pipeDestroy(this._portalService.admitGuest$, async (response) => {
            if (response) {
                await this.sendSignal(EVENT_SESSIONS_HUB_NAME, this.otherEventUserIds, new SignalData(ConferenceAction.AdmitGuest, response));
            }
        });
    }

    async initHub(): Promise<void> {
        this.addHub(EVENT_SESSIONS_HUB_NAME, await this._hubService.getEventSessionsHub({ 'userId': this.appSession.userId }));
        this.startHubConnection(EVENT_SESSIONS_HUB_NAME, () => {
            this.hubConnected = true;
            this.initRoom();
            this.handleHubEvents();
        });
    }

    private handleHubEvents(): void {
        this.receiveSignal(EVENT_SESSIONS_HUB_NAME, async (sSignalData: string) => {
            const signalData = new SignalData();
            Object.assign(signalData, JSON.parse(sSignalData));
            const eventUserObj = signalData.getDataObject() as EventUserDto

            switch (signalData.action) {
                case ConferenceAction.StartEvent:
                    console.log('@@@ receiveSignal - StartEvent');
                    this.eventStarting = false;
                    this.eventStarted = true;
                    break;

                case ConferenceAction.EndEvent:
                    console.log('@@@ receiveSignal - EndEvent');
                    this.eventStarted = false;
                    this.eventJoined = false;
                    break;

                case ConferenceAction.JoinEvent:
                    console.log('@@@ receiveSignal - JoinEvent');
                    this.joiningEventUsers.push(eventUserObj);
                    this._portalService.attendeeJoined = eventUserObj;
                    break;

                case ConferenceAction.GuestJoined:
                    console.log('@@@ receiveSignal - GuestJoined');
                    this.attendees.push(eventUserObj);
                    this._portalService.guestJoined = eventUserObj;
                    break;

                case ConferenceAction.AutoAdmitChange:
                    console.log('@@@ receiveSignal - AutoAdmitChange');
                    this.eventModel.autoAdmitAttendees = signalData.getDataObject() as boolean;
                    this._portalService.event = this.eventModel;
                    break;

                case ConferenceAction.AdmitGuest:
                    console.log('@@@ receiveSignal - AdmitGuest');
                    if (eventUserObj.user.id === this.eventUser.user.id) {
                        await this.joinRoom();
                        this.eventJoined = true;
                    }
                    break;

                case ConferenceAction.LobbyEntered:
                    console.log('@@@ receiveSignal - LobbyEntered');
                    if (!this.allEventUsers.some(u => u.user.id === eventUserObj.user.id)) {
                        this.allEventUsers.push(eventUserObj);
                        this._portalService.attendees = this.allEventUsers.filter(e => e.type !== EventUserType.Host);
                    }
                    if (eventUserObj.user.id !== this.eventHostUserId) {
                        this._portalService.lobbyUser = eventUserObj;
                    } else if (!this.eventModel.autoAdmitAttendees && this.inLobby) {
                        this.sendSignal(EVENT_SESSIONS_HUB_NAME, [this.eventHost.user.id], new SignalData(ConferenceAction.LobbyEntered, this.eventUser));
                    }
                    break;

                // case PollSignalAction.SharePoll:
                //     case PollSignalAction.PollStopped:
                //     case PollSignalAction.PollClosed:
                //         console.log(modal);
                //         if (modal) {
                //         modal.hide();
                //         modal = undefined;
                //         }
                //         break;
            }
        });
    }

    initRoom(): void {
        const ws = 'wss://easy.innovailable.eu/' + encodeURI(this.eventId);
        const channel = new rtc.WebSocketChannel(ws);
        const signaling = new rtc.MucSignaling(channel);
        const options = { stun: 'stun:stun.innovailable.eu' };

        this.room = new rtc.Room(signaling, options);
        this.subsribeToPeerJoins();
    }

    subsribeToPeerJoins() {
        this.room.on('peer_joined', (peer: rtc.RemotePeer) => {
            this.joiningEventUsers.forEach(joiningEventUser => {
                const videoEl = joiningEventUser.type === EventUserType.Host ? this.viewProps.presenterVideoEl :
                    this.viewProps.attendeeVideosEl.find(e => +e.nativeElement.id === joiningEventUser.user.id);
                const videoStream = new rtc.MediaDomElement(videoEl.nativeElement, peer);
                this.subscribeToPeerEvents({ peer, videoEl });
            });
        });
    }

    subscribeToPeerEvents(peerLeaveProps: PeerLeaveProperties) {
        peerLeaveProps.peer.on('left', () => document.removeChild(peerLeaveProps.videoEl.nativeElement));
    }

    async initDevice(videoEl: HTMLVideoElement): Promise<void> {
        const stream = await this.room.local.addStream({
            video: {
                deviceId: this.selectedMachineDevice.videoDevice.id,
            },
            audio: {
                deviceId: this.selectedMachineDevice.audioDevice.id,
                echoCancellation: { exact: true },
                // @ts-ignore
                googEchoCancellation: { exact: true },
                googAutoGainControl: { exact: true },
                googNoiseSuppression: { exact: true },
            },
        });
        const videoDom = new rtc.MediaDomElement(videoEl, stream);
    }

    async joinRoom(): Promise<void> {
        const eventUserId = this.eventUser.user.id;
        const allOtherAttendeeIds = this.allEventUsers.filter(e => e.user.id !== eventUserId).map(e => e.user.id);
        await this.sendSignal(EVENT_SESSIONS_HUB_NAME, allOtherAttendeeIds, new SignalData(ConferenceAction.JoinEvent, this.eventUser));
        await this.room.connect();
    }

    async onAutoAdmitChange(): Promise<void> {
        this._portalService.event = this.eventModel;
        this.pipeDestroy(this._eventsService.updateAutoAdmit(this.eventModel.id, this.eventModel.autoAdmitAttendees));
        await this.sendSignal(EVENT_SESSIONS_HUB_NAME, this.otherEventUserIds, new SignalData(ConferenceAction.AutoAdmitChange, this.eventModel.autoAdmitAttendees));
    }

    async onLobbyEntered(selectedMachineDevice: SelectedMachineDevice): Promise<void> {
        this.inLobby = true;
        this.selectedMachineDevice = selectedMachineDevice;
        if (this.isHost) {
          this.initDevice(this.viewProps.presenterVideoEl.nativeElement);
          this.sendSignal(EVENT_SESSIONS_HUB_NAME, this.otherEventUserIds, new SignalData(ConferenceAction.LobbyEntered, this.eventUser));
        } else {
          this.attendees.push(this.eventUser);
          if (!this.eventModel.autoAdmitAttendees) {
            this.sendSignal(EVENT_SESSIONS_HUB_NAME, [this.eventHostUserId], new SignalData(ConferenceAction.LobbyEntered, this.eventUser));
          }
        }
    }

    async onJoinClick(): Promise<void> {
        if (this.eventModel.autoAdmitAttendees) {
          await this.joinRoom();
          this.eventJoined = true;
        } else {
          this.waiting = true;
          await this.sendSignal(EVENT_SESSIONS_HUB_NAME, [this.eventHostUserId], new SignalData(ConferenceAction.GuestJoined, this.eventUser));
        }
    }

    async onUnshareVideo(): Promise<void> {
        this.room.leave();
        this.initRoom();
        await this.initDevice(this.viewProps.presenterVideoEl.nativeElement);
        await this.joinRoom();
    }

    async onStartEventClick(): Promise<void> {
        this.eventStarting = true;
        await this.joinRoom();
        const userIds = this.allEventUsers.map(e => e.user.id);
        this.sendSignal(EVENT_SESSIONS_HUB_NAME, userIds, new SignalData(ConferenceAction.StartEvent));
    }

    async onEndEventClick(): Promise<void> {
        const options: ModalDialogOptions = {
          title: this.l('AreYouSure'),
          text: this.l('EndEventConfirmation'),
          confirmCb: async () => {
            const userIds = this.allEventUsers.map(e => e.user.id);
            this.sendSignal(EVENT_SESSIONS_HUB_NAME, userIds, new SignalData(ConferenceAction.EndEvent));
          }
        };
        this._modalDialogService.showConfirmDialog(options);
      }
}
