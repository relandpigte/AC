import { TitleCasePipe } from '@angular/common';
import { HubService } from '@app/_shared/services/hub.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Utils } from '../helpers/utils';
import { CommentsServiceProxy, HubEvent, NotificationDto, NotificationsServiceProxy, PostsServiceProxy } from '../service-proxies/service-proxies';
import { StateServiceBase, StateUpdate } from './state-base.service';

export enum notificationsType {
    all = 'all',
}

export class NotificationsStateService extends StateServiceBase {
    notifications: Map<string, NotificationDto> = new Map();
    totalNotificationsCount: number;

    notifications$: Subject<StateUpdate<NotificationDto>> = new Subject();
    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    hub: any;

    type: notificationsType = notificationsType.all;
    fns = {
        [notificationsType.all]: 'getAll',
    };

    getAll = () => Array.from(this.notifications.values());
    getAllUnread = () => this.getAll().filter(n => !n.readTime);

    constructor(
        private _hubService: HubService,
        private _commentsService: CommentsServiceProxy,
        private _postsService: PostsServiceProxy,
        private _notificationsService: NotificationsServiceProxy,
        private _titleCasePipe: TitleCasePipe,
    ) {
        super();
    }

    async loadData(component: any, userId: number) {
        this.loading$.next(true);
        try {
          const notifications = await this._notificationsService[this.fns[this.type ?? notificationsType.all]](...this.loadArgs).toPromise();
          this.notifications = Utils.toMap(notifications);
          this.totalNotificationsCount = notifications.length;
        } catch (err) {
          console.error(err);
        }
        this.loading$.next(false);
    }

    async stop() {
        super.stop();
        if (this.hub) {
            this.hub.off(HubEvent[HubEvent.NotificationCreated], this.handleUpsertNotifications);
            this.hub.off(HubEvent[HubEvent.NotificationUpdated], this.handleUpsertNotifications);
            this.hub.off(HubEvent[HubEvent.NotificationDeleted], this.handleDeleteNotifications);
        }
    }

    protected async setupSubscriptions(component: any, userId: number) {
        try {
            this.hub = await this._hubService.getNotificationsHub(...this.updateArgs);
            this.hub.on(HubEvent[HubEvent.NotificationCreated], this.handleUpsertNotifications);
            this.hub.on(HubEvent[HubEvent.NotificationUpdated], this.handleUpsertNotifications);
            this.hub.on(HubEvent[HubEvent.NotificationDeleted], this.handleDeleteNotifications);
        } catch (err) {
            console.error(err);
        }
        return null;
    }

    handleUpsertNotifications = async (notification: NotificationDto) => {
        this.loading$.next(true);
        this.updateFromMap(this.notifications, Utils.toObjectMap([notification], (c) => c.id, (p) => p), this.notifications$);
        this.loading$.next(false);
    };

    handleDeleteNotifications = async (notification: NotificationDto) => {
        this.loading$.next(true);
        this.updateFromMap(this.notifications, { [notification.id]: null }, this.notifications$);
        this.loading$.next(false);
    }
}
