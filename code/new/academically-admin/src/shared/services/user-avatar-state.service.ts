import { HubService } from '@app/_shared/services/hub.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Utils } from '../helpers/utils';
import { HubEvent, UserServiceProxy, UserStatus, UserStatusLogDto } from '../service-proxies/service-proxies';
import { StateServiceBase, StateUpdate } from './state-base.service';
import { take } from 'rxjs/operators';

export enum userStatusType {
  all = 'all',
}

const USER_AVATAR_HUB_NAME = 'userAvatarHub';

export class UserAvatarStateService extends StateServiceBase {
  userStatusLog: Map<string, UserStatusLogDto> = new Map();

  userStatusLog$: Subject<StateUpdate<UserStatusLogDto>> = new Subject<StateUpdate<UserStatusLogDto>>();
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  type: userStatusType;
  fns = {
    [userStatusType.all]: 'getAllUserStatusLogs'
  };

  constructor(
    private _hubService: HubService,
    private _userService: UserServiceProxy
  ) {
    super();
  }

  createUserStatusReportLog = (status: UserStatus): void => {
    this._userService.createUserStatusLog(status)
      .pipe(take(1))
      .subscribe();
  }

  getUserStatusLog = (): UserStatusLogDto[] => Array.from(this.userStatusLog.values());

  handleNewLoggedInUsers = async (userStatusLog: UserStatusLogDto): Promise<void> => {
    this.loading$.next(true);
    this.updateFromMap(this.userStatusLog, Utils.toObjectMap([userStatusLog], (c) => c.id, (p) => p), this.userStatusLog$);
    this.loading$.next(false);
  }

  async loadData(component: any, userId: number): Promise<void> {
    this.loading$.next(true);
    try {
      const userStatusLog = await this._userService[this.fns[this.type ?? userStatusType.all]](...this.loadArgs).toPromise();
      this.userStatusLog = Utils.toMap(userStatusLog);
    } catch (err) {
      console.error(err);
    }
    this.loading$.next(false);
  }

  async stop(): Promise<void> {
    super.stop();
    if (this.getHub(USER_AVATAR_HUB_NAME)) {
      this.getHub(USER_AVATAR_HUB_NAME).off(HubEvent[HubEvent.NewUserLoggedIn], this.handleNewLoggedInUsers);
      this.stopHubConnection(USER_AVATAR_HUB_NAME);
    }
  }

  protected async setupSubscriptions(component: any, userId: number): Promise<any> {
    try {
      this.addHub(USER_AVATAR_HUB_NAME, await this._hubService.getNewUserStatusLogHub(...this.updateArgs));
      this.getHub(USER_AVATAR_HUB_NAME).on(HubEvent[HubEvent.NewUserLoggedIn], this.handleNewLoggedInUsers);
      this.startHubConnection(USER_AVATAR_HUB_NAME);
    } catch (err) {
      console.error(err);
    }
    return null;
  }
}
