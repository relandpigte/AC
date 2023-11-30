import { TitleCasePipe } from '@angular/common';
import { HubService } from '@app/_shared/services/hub.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Utils } from '../helpers/utils';
import { CommentsServiceProxy, HubEvent, NotificationDto, NotificationsServiceProxy, PostsServiceProxy } from '../service-proxies/service-proxies';
import { StateServiceBase, StateUpdate } from './state-base.service';

export enum notificationsType {
    all = 'all',
}

const NOTIFICATIONS_HUB_NAME = 'notificationsHub';
export class NotificationsStateService extends StateServiceBase {
    notifications: Map<string, NotificationDto> = new Map();
    totalNotificationsCount: number;

    notifications$: Subject<StateUpdate<NotificationDto>> = new Subject();
    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

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
        if (this.getHub(NOTIFICATIONS_HUB_NAME)) {
            this.getHub(NOTIFICATIONS_HUB_NAME).off(HubEvent[HubEvent.NotificationCreated], this.handleUpsertNotifications);
            this.getHub(NOTIFICATIONS_HUB_NAME).off(HubEvent[HubEvent.NotificationUpdated], this.handleUpsertNotifications);
            this.getHub(NOTIFICATIONS_HUB_NAME).off(HubEvent[HubEvent.NotificationDeleted], this.handleDeleteNotifications);
            this.stopHubConnection(NOTIFICATIONS_HUB_NAME);
        }
    }

    protected async setupSubscriptions(component: any, userId: number) {
        try {
            this.addHub(NOTIFICATIONS_HUB_NAME, await this._hubService.getNotificationsHub(...this.updateArgs));
            this.getHub(NOTIFICATIONS_HUB_NAME).on(HubEvent[HubEvent.NotificationCreated], this.handleUpsertNotifications);
            this.getHub(NOTIFICATIONS_HUB_NAME).on(HubEvent[HubEvent.NotificationUpdated], this.handleUpsertNotifications);
            this.getHub(NOTIFICATIONS_HUB_NAME).on(HubEvent[HubEvent.NotificationDeleted], this.handleDeleteNotifications);
            this.startHubConnection(NOTIFICATIONS_HUB_NAME);
        } catch (err) {
            console.error(err);
        }
        return null;
    }

    handleUpsertNotifications = async (notification: NotificationDto) => {
        this.loading$.next(true);
        const upserted = await this._notificationsService.get(notification.id).toPromise();
        this.updateFromMap(this.notifications, Utils.toObjectMap([upserted], (c) => c.id, (p) => p), this.notifications$);
        this.loading$.next(false);
    };

    handleDeleteNotifications = async (notification: NotificationDto) => {
        this.loading$.next(true);
        this.updateFromMap(this.notifications, { [notification.id]: null }, this.notifications$);
        this.loading$.next(false);
    }
}
