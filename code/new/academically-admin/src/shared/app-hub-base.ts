import { Injector, OnDestroy } from '@angular/core';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';

export class SignalData<TObject> {
    action: any;
    data: string;

    constructor(action?: any, data?: TObject) {
      this.action = action;
      if (data !== undefined) {
        this.data = JSON.stringify(data);
      } else {
        this.data = '';
      }
    }

    public getDataObject(): TObject {
      return (this.data ? JSON.parse(this.data) : null) as TObject;
    }
}

const DEFAULT_SEND_METHOD = 'sendSignal';
const DEFAULT_RECEIVE_METHOD = 'receiveSignal';

export abstract class AppHubBase implements OnDestroy {
    // there can be multiple hubs in a single component, hence we use map here
    private hubs = new Map<string, HubConnection>();

    ngOnDestroy(): void {
        Object.keys(this.hubs).forEach(key => this.stopHubConnection(key));
    }

    protected addHub(key: string, hub: HubConnection) {
        this.hubs.set(key, hub);
    }

    protected getHub(key: string): HubConnection {
        return this.hubs.get(key);
    }

    // default send signal method via direct signalr connection
    protected async sendSignal<TObject>(key:string, userIds: number[], signalData: SignalData<TObject>, callback?: () => void): Promise<void> {
        if (!this.hubs?.has(key)) return;
        const sSignalData = JSON.stringify(signalData);
        await this.hubs.get(key).invoke(DEFAULT_SEND_METHOD, userIds, sSignalData)
          .then(() => {
            if (callback) callback();
          });
    }

    // default receive signal method via direct signalr connection
    protected async receiveSignal(key: string, callback: (sSignalData: string) => void): Promise<void> {
        if (!this.hubs?.has(key)) return;
        this.hubs.get(key).on(DEFAULT_RECEIVE_METHOD, async (sSignalData: string) => {
            callback(sSignalData);
        });
    }

    // start a custom local hub of the caller
    protected startCustomHubConnection(customHub: HubConnection): void {
        if (!customHub) return;
        customHub.start().then(() => this.onHubStartSuccess).catch((err) => this.onHubStartFailure);
    }

    protected startHubConnection(key: string, callback?: () => void): void {
        if (!this.hubs?.has(key)) return;
        this.hubs.get(key).start().then(() => this.onHubStartSuccess(callback)).catch((err) => this.onHubStartFailure);
    }

    protected stopHubConnection(key: string): void {
        if (!this.hubs?.has(key)) return;
        const hub = this.hubs.get(key);
        if (hub.state === HubConnectionState.Connected) { // if hub is connected, stop it
            hub.stop().then(() => this.onHubStopSuccess(key)).catch((err) => this.onHubStopFailure);
        } else if (hub.state === HubConnectionState.Disconnected) { // if hub is disconnected, remove it from the map directly
            this.onHubStopSuccess(key);
        } else { // if hub is processing, wait for 500ms and try again
            setTimeout(() => this.stopHubConnection(key), 500);
        }
    }

    protected onHubStartSuccess = (callback?: () => void) => {
        if (callback) callback();
        console.log('SignalR connection started.');
    }

    protected onHubStartFailure = (err) => {
        console.error('Error while establishing signalr connection: ' + err);
    }

    protected onHubStopSuccess = (key) => {
        this.hubs.delete(key); // we remove the hub from the map when it is stopped
        console.log('SignalR connection stopped.');
    }

    protected onHubStopFailure = (err) => {
        console.error('Error while establishing signalr connection: ' + err);
    }
}
