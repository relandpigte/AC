import { HubService } from '@app/_shared/services/hub.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Utils } from '../helpers/utils';
import { HubEvent, UserServiceProxy, UserStatus, UserStatusLogDto } from '../service-proxies/service-proxies';
import { StateServiceBase, StateUpdate } from './state-base.service';
import { take } from 'rxjs/operators';

export enum userStatusType {
  all = 'all',
}

export class UserAvatarStateService extends StateServiceBase {
  userStatusLog: Map<string, UserStatusLogDto> = new Map();

  userStatusLog$: Subject<StateUpdate<UserStatusLogDto>> = new Subject<StateUpdate<UserStatusLogDto>>();
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  hub: any;
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
    if (this.hub) {
      this.hub.off(HubEvent[HubEvent.NewUserLoggedIn], this.handleNewLoggedInUsers);
    }
  }

  protected async setupSubscriptions(component: any, userId: number): Promise<any> {
    try {
      this.hub = await this._hubService.getNewUserStatusLogHub(...this.updateArgs);
      this.hub.on(HubEvent[HubEvent.NewUserLoggedIn], this.handleNewLoggedInUsers);
    } catch (err) {
      console.error(err);
    }
    return null;
  }
}
