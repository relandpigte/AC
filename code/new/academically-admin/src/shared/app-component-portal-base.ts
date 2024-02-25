import { ElementRef, Injectable, Injector, OnDestroy, OnInit, QueryList } from '@angular/core';
import { HubService } from '@app/_shared/services/hub.service';
import { SelectedMachineDevice } from '@app/dashboard/events/portal/broadcast/student/portal/_components/device-settings/device-settings.component';
import { PortalService } from '@app/dashboard/events/portal/broadcast/student/portal/_services/portal.service';
import * as rtc from 'rtc-lib';
import { AppComponentBase } from './app-component-base';
import { SignalData } from './app-hub-base';
import { EventDto, EventUserDto, EventUserType, EventsServiceProxy, ServiceFeatureFlagDto } from './service-proxies/service-proxies';
import { ModalDialogOptions, ModalDialogService } from './services/modal-dialog.service';
import { Observable, combineLatest, of, zip } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';

export interface PortalProperties {
    serverProps: PortalServierProperties;
    viewProps: PortalViewElementsProperties;
}

export interface PortalServierProperties {
    signalingServerUrl: string;
    stunServerUrl: string;
}

export interface PortalViewElementsProperties {
    presenterVideoEl: ElementRef;
    attendeeVideosEl: QueryList<ElementRef>;
}

export interface PortalAttendeeProperties {
    user: EventUserDto;
    isAdmitted: boolean;
    isCurrentUser: boolean;
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

export interface ServiceFeatureFlagMapping {
    [key: string]: { [type in EventUserType]?: string[] };
};

export const EVENT_SESSIONS_HUB_NAME = 'eventSessionsHub';
export const EVENT_SETTINGS_HUB_NAME = 'eventSettingsHub';
export const EVENT_USER_SETTINGS_HUB_NAME = 'eventUserSettingsHub';

@Injectable()
export abstract class AppComponentPortalBase extends AppComponentBase implements OnInit, OnDestroy {
    _hubService: HubService;
    _portalService: PortalService;
    _modalDialogService: ModalDialogService;
    _eventsService: EventsServiceProxy;

    private props: PortalProperties;
    private room: rtc.Room;
    private selectedMachineDevice: SelectedMachineDevice;

    eventId: string;
    eventModel = new EventDto();
    eventSettings = new ServiceFeatureFlagDto();

    eventHost = new EventUserDto();
    eventUser = new EventUserDto();
    allEventUsers: EventUserDto[] = [];
    joiningEventUsers: EventUserDto[] = [];
    attendees: { [key: string]: PortalAttendeeProperties } = {};

    isPortalInitialized = false;
    hubConnected = false;
    eventStarting = false;
    eventStarted = false;
    eventJoined = false;
    inLobby = false;
    showDeviceSettings = true;
    requestToSpeakDisabled = false;
    sharingWhiteboard = false;
    waiting = false;

    streams: rtc.Stream[] = [];

    constructor(
        injector: Injector
    ) {
        super(injector);
        this._hubService = injector.get(HubService);
        this._portalService = injector.get(PortalService);
        this._modalDialogService = injector.get(ModalDialogService);
        this._eventsService = injector.get(EventsServiceProxy);
    }

    get admittedAttendees(): EventUserDto[] { return Object.values(this.attendees).filter(a => a.user && (a.isAdmitted || a.isCurrentUser)).map(a => a.user); }
    get eventHostUserId(): number { return this.eventHost.user.id; }
    get otherEventUserIds(): number[] { return this.allEventUsers.filter(e => e.user.id !== this.eventUser.user.id).map(e => e.user.id); }
    get isHost(): boolean { return this.eventModel?.creatorUserId === this.appSession.userId; }

    async ngOnInit() {
        this.pipeDestroy(this._portalService.featureFlags$, flags => {
            this.eventSettings.init(flags);
            setTimeout(() => this.cdr.detectChanges());
        });
    }

    async ngOnDestroy() {
        super.ngOnDestroy();
        // this.disconnectTrack(this.presenterStream);
        // this.disconnectTrack(this.attendeeStream);
    }

    async initPortal(props: PortalProperties) {
        this.props = props;
        this.subscribeToPortalEvents();
        await this.initHubs();
        this.initPortalViewProperties();
        this.isPortalInitialized = true;
    }

    private initPortalViewProperties() {
        this.props.viewProps.attendeeVideosEl?.changes.subscribe(async (val: any) => {
            if (this.props.viewProps.attendeeVideosEl.length && !this.eventStarted) {
                const currentEl = this.props.viewProps.attendeeVideosEl.last.nativeElement;
                await this.initDevice(currentEl);
            }
        });
    }

    private subscribeToPortalEvents() {
        // event model
        this.pipeDestroy(this._portalService.event$, async (event: EventDto) => {
            this.eventModel = event;
        });

        // guest admissions
        this.pipeDestroy(this._portalService.admitGuest$, async (guestUser: EventUserDto) => {
            if (guestUser) {
                await this.sendSignal(EVENT_SESSIONS_HUB_NAME, this.otherEventUserIds, new SignalData(ConferenceAction.AdmitGuest, guestUser));
            }
        });
    }

    private async initHubs(): Promise<void> {
        await this.initEventSessionHub();
        await this.initEventSettingsHub();
        await this.initEventUserSettingsHub();
    }

    private async initEventSessionHub(): Promise<void> {
        this.addHub(EVENT_SESSIONS_HUB_NAME, await this._hubService.getEventSessionsHub({ 'userId': this.appSession.userId }));
        this.startHubConnection(EVENT_SESSIONS_HUB_NAME, () => {
            this.hubConnected = true;
            this.initRoom();
            this.handleHubEvents();
        });
    }

    private async initEventSettingsHub(): Promise<void> {
        this.addHub(EVENT_SETTINGS_HUB_NAME, await this._hubService.getEventSettingsHub({ 'referenceId': this.eventId }));
        this.startHubConnection(EVENT_SETTINGS_HUB_NAME);
    }

    private async initEventUserSettingsHub(): Promise<void> {
        this.addHub(EVENT_USER_SETTINGS_HUB_NAME, await this._hubService.getEventSettingsHub({ 'userId': this.appSession.userId, 'referenceId': this.eventId }));
        this.startHubConnection(EVENT_USER_SETTINGS_HUB_NAME);
    }

    private initRoom(): void {
        const ws = this.props.serverProps.signalingServerUrl + encodeURI(this.eventId);
        const channel = new rtc.WebSocketChannel(ws);
        const signaling = new rtc.MucSignaling(channel);
        const options = { stun: this.props.serverProps.stunServerUrl };

        this.room = new rtc.Room(signaling, options);
        this.subsribeToRoomEvents();
    }

    private async initDevice(videoEl: HTMLVideoElement): Promise<void> {
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
        this.streams.push(stream);
    }

    private subsribeToRoomEvents() {
        // peer joins
        this.room.on('peer_joined', (peer: rtc.RemotePeer) => {
            this.joiningEventUsers.forEach(joiningEventUser => {
                setTimeout(() => {
                    const videoEl = joiningEventUser.type === EventUserType.Host ? this.props.viewProps.presenterVideoEl :
                        this.props.viewProps.attendeeVideosEl.find(e => +e.nativeElement.id === joiningEventUser.user.id);
                    const videoStream = new rtc.MediaDomElement(videoEl.nativeElement, peer);
                    this.subscribeToPeerEvents({ peer, videoEl });
                })
            });
        });
    }

    private subscribeToPeerEvents(peerLeaveProps: PeerLeaveProperties) {
        // peer left
        peerLeaveProps.peer.on('left', () => document.removeChild(peerLeaveProps.videoEl.nativeElement));
    }

    private handleHubEvents(): void {
        this.handleEventSessionHubEvents();
        this.handleEventSettingsHubEvents();
        this.handleEventUserSettingsHubEvents();
    }

    private handleEventSessionHubEvents(): void {
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
                    await this.leaveRoom();
                    break;

                case ConferenceAction.JoinEvent:
                    console.log('@@@ receiveSignal - JoinEvent');
                    this.joiningEventUsers.push(eventUserObj);
                    this._portalService.attendeeJoined = eventUserObj;
                    this.attendees[eventUserObj.user.id] = { ...this.attendees[eventUserObj.user.id], isAdmitted: true };
                    break;

                case ConferenceAction.GuestJoined:
                    console.log('@@@ receiveSignal - GuestJoined');
                    this.attendees[eventUserObj.user.id] = {
                        user: eventUserObj,
                        isAdmitted: false,
                        isCurrentUser: eventUserObj.user.id === this.eventUser.user.id
                    };
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
                    }
                    break;
            }
        });
    }

    private handleEventSettingsHubEvents(): void {
        this.receiveSignal(EVENT_SETTINGS_HUB_NAME, async (sSignalData: string) => {
            const settings = ServiceFeatureFlagDto.fromJS(sSignalData);
            this._portalService.featureFlags = settings;
        });
    }

    private handleEventUserSettingsHubEvents(): void {
        this.receiveSignal(EVENT_USER_SETTINGS_HUB_NAME, async (sSignalData: string) => {
            const settings = ServiceFeatureFlagDto.fromJS(sSignalData);
            this._portalService.featureFlags = settings;
        });
    }

    private async joinRoom(): Promise<void> {
        const eventUserId = this.eventUser.user.id;
        const allOtherAttendeeIds = this.allEventUsers.filter(e => e.user.id !== eventUserId).map(e => e.user.id);
        await this.sendSignal(EVENT_SESSIONS_HUB_NAME, allOtherAttendeeIds, new SignalData(ConferenceAction.JoinEvent, this.eventUser));
        await this.room.connect();
    }

    private async leaveRoom(): Promise<void> {
        // reset flags
        this.eventStarted = false;
        this.eventJoined = false;
        this.waiting = false;

        // let all attendees leave
        Object.values(this.attendees).forEach(a => {
            this._portalService.attendeeLeft = a.user;
        });
        this.attendees = {};

        // stop all streams and leave room
        this.streams.forEach(s => s.getTracks('both').forEach(s => s.stop()));
        this.room.leave();

        // reset room
        this.initRoom();
        this.props.viewProps.presenterVideoEl.nativeElement.load();
        this.onLobbyEntered(this.selectedMachineDevice);
    }

    private disconnectTrack(stream: MediaStream): void {
        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = false;
                track.stop();
                setTimeout(() => {
                    stream.removeTrack(track);
                    console.log('audio track removed');
                }, 500);
            });
            stream.getVideoTracks().forEach(track => {
                track.enabled = false;
                track.stop();
                setTimeout(() => {
                    stream.removeTrack(track);
                    console.log('video track removed');
                }, 500);
            });
        }
    }

    private isPortalRtcNotInitialized(): boolean {
        if (this.isPortalInitialized) return false;
        this.notify.warn('RTC server is not initialized. Please try again later.');
        return true;
    }

    // PUBLIC FUNCTIONS

    async onAutoAdmitChange(): Promise<void> {
        if (this.isPortalRtcNotInitialized()) return;
        this._portalService.event = this.eventModel;
        this.pipeDestroy(this._eventsService.updateAutoAdmit(this.eventModel.id, this.eventModel.autoAdmitAttendees));
        await this.sendSignal(EVENT_SESSIONS_HUB_NAME, this.otherEventUserIds, new SignalData(ConferenceAction.AutoAdmitChange, this.eventModel.autoAdmitAttendees));
    }

    async onLobbyEntered(selectedMachineDevice: SelectedMachineDevice): Promise<void> {
        if (this.isPortalRtcNotInitialized()) return;
        this.inLobby = true;
        this.selectedMachineDevice = selectedMachineDevice;
        if (this.isHost) {
            this.initDevice(this.props.viewProps.presenterVideoEl.nativeElement);
            this.sendSignal(EVENT_SESSIONS_HUB_NAME, this.otherEventUserIds, new SignalData(ConferenceAction.LobbyEntered, this.eventUser));
        } else {
            this.attendees[this.eventUser.user.id] = {
                user: this.eventUser,
                isAdmitted: false,
                isCurrentUser: true
            };
            if (!this.eventModel.autoAdmitAttendees) {
                this.sendSignal(EVENT_SESSIONS_HUB_NAME, [this.eventHostUserId], new SignalData(ConferenceAction.LobbyEntered, this.eventUser));
            }
        }
    }

    async onJoinClick(): Promise<void> {
        if (this.isPortalRtcNotInitialized()) return;
        if (this.eventModel.autoAdmitAttendees) {
            await this.joinRoom();
            this.eventJoined = true;
        } else {
            this.waiting = true;
            await this.sendSignal(EVENT_SESSIONS_HUB_NAME, [this.eventHostUserId], new SignalData(ConferenceAction.GuestJoined, this.eventUser));
        }
    }

    async onShareVideo(file: File): Promise<void> {
        if (this.isPortalRtcNotInitialized()) return;
        // @TODO: replace with logic that uses a separate room for other types of presentation
        this.room.leave();
        this.initRoom();
        const presenterVideo = this.props.viewProps.presenterVideoEl.nativeElement as HTMLVideoElement;
        presenterVideo.src = URL.createObjectURL(file);
        presenterVideo.srcObject = undefined;
        presenterVideo.pause();
        presenterVideo.controls = true;
        presenterVideo.volume = 1;
        presenterVideo.muted = false;
        const stream = (presenterVideo as any).captureStream() as MediaStream;
        await this.room.local.addStream(new rtc.Stream(stream));
        await this.joinRoom();
        await presenterVideo.play();
    }

    async onUnshareVideo(): Promise<void> {
        if (this.isPortalRtcNotInitialized()) return;
        this.room.leave();
        this.initRoom();
        await this.initDevice(this.props.viewProps.presenterVideoEl.nativeElement);
        await this.joinRoom();
    }

    async onStartEventClick(): Promise<void> {
        if (this.isPortalRtcNotInitialized()) return;
        this.eventStarting = true;
        await this.joinRoom();
        const userIds = this.allEventUsers.map(e => e.user.id);
        this.sendSignal(EVENT_SESSIONS_HUB_NAME, userIds, new SignalData(ConferenceAction.StartEvent));
    }

    async onEndEventClick(): Promise<void> {
        if (this.isPortalRtcNotInitialized()) return;
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
