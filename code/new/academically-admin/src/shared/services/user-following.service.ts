import { Injectable } from '@angular/core';
import { finalize, take } from 'rxjs/operators';

import { UserDto, UserFollowerDto, UserFollowersServiceProxy } from '../service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';

@Injectable({
  providedIn: 'root',
})
export class UserFollowingService {
  private userFollowed: UserFollowerDto[];
  private userLoaders: Map<string, { isFollowingUser?: boolean, isUnfollowingUser?: boolean }> = new Map();

  constructor(
    private _userFollowerService: UserFollowersServiceProxy,
    private appSession: AppSessionService
  ) {
    this.getFollowedUser();
  }

  public onFollowUser(user: UserDto): void {
    this.setUserLoading(user.id.toString(), 'isFollowingUser', true);
    this._userFollowerService.create(user.id)
      .pipe(take(1))
      .pipe(finalize(() => {
        this.setUserLoading(user.id.toString(), 'isFollowingUser', false);
      }))
      .subscribe(followed => {
        this.addFollowedUser(followed);
      });
  }

  public onUnFollowUser(user: UserDto): void {
    const userFollower = Array.from(this.userFollowed.values()).find(t => t.userId === user.id);
    this.setUserLoading(user.id.toString(), 'isUnFollowingUser', true);

    this._userFollowerService.delete(userFollower.id)
      .pipe(take(1))
      .pipe(finalize(() => {
        this.setUserLoading(user.id.toString(), 'isUnFollowingUser', false);
      }))
      .subscribe(() => {
        this.removeFollowedUser(userFollower.id);
      });
  }

  public isUserLoading(id: string, property?: string): boolean {
    const userLoaders = this.userLoaders.get(id);
    if (!userLoaders) {
      return false;
    }
    if (property) {
      return userLoaders[property];
    } else {
      return Object.keys(userLoaders).some(p => userLoaders[p]);
    }
  }

  public isUserFollowing(user: UserDto): boolean {
    return this.userFollowed?.some(u => u.userId === user.id);
  }

  public isCurrentUser(userId?: number): boolean {
    if (!userId) {
      return false;
    }
    return userId === this.appSession?.user?.id;
  }

  public addFollowedUser(user: UserFollowerDto): void {
    this.userFollowed.push(user);
  }

  public removeFollowedUser(followerId: string): void {
    this.userFollowed = this.userFollowed.filter(u => u.id !== followerId);
  }

  private setUserLoading(id: string, property: string, value: boolean): void {
    if (!this.userLoaders.has(id)) {
      this.userLoaders.set(id, {});
    }
    const userLoaders = this.userLoaders.get(id);
    userLoaders[property] = value;
    if (Object.keys(userLoaders).every(p => !userLoaders[p])) {
      this.userLoaders.delete(id);
    }
  }

  private getFollowedUser(): void {
    this._userFollowerService.getFollowing()
      .pipe(take(1))
      .subscribe(user => {
        this.userFollowed = user;
      });
  }
}
