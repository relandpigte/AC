
import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ReactionColorClass, ReactionIcons } from '@shared/enums/post/reaction-group.enum';
import { ReactionDto, ReactionType, UserDto } from '@shared/service-proxies/service-proxies';
import { UserFollowingService } from '@shared/services/user-following.service';
import * as _ from 'lodash';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-reaction-users',
    templateUrl: './reaction-users.component.html',
    styleUrls: ['./reaction-users.component.scss']
})
export class ReactionUsersComponent extends AppComponentBase implements OnInit {
    reactions: ReactionDto[];

    reactionCounts: { [type in ReactionType]?: number } = {};
    reactionUsers: { [type in ReactionType]?: UserDto[] } = {};

    selectedReactionType: ReactionType = null;

    constructor(
        injector: Injector,
        private _modalRef: BsModalRef,
        private _userFollowingService: UserFollowingService
    ) {
        super(injector);
    }

    ngOnInit() {
        if (this.reactions) {
            this.initReactionCounts();
            this.initReactionUsers();
        }
    }

    get currentUserId() { return this.appSession.userId; }

    private initReactionCounts(): void {
        this.reactions.forEach(r => this.reactionCounts[r.type] = (this.reactionCounts[r.type] ?? 0) + 1);
    }

    private initReactionUsers(): void {
        this.reactions.forEach(r => this.reactionUsers[r.type] = [...(this.reactionUsers[r.type] ?? []), r.creatorUser]);
    }

    getReactionUsers(): UserDto[] {
        if (this.selectedReactionType) return this.reactionUsers[this.selectedReactionType];
        return _.flatMap(this.reactionUsers);
    }

    getUserReaction(user: UserDto): ReactionType {
        return this.reactions.find(r => r.creatorUserId === user.id)?.type ?? null;
    }

    getReactionIcon(reactionType: ReactionType) {
        return ReactionIcons[reactionType];
    }

    getReactionIconSrc(reactionType: ReactionType) {
        return `/assets/img/emoticons/comment/${this.getReactionIcon(reactionType)}.svg`;
    }

    isUserFollowing(user: UserDto): boolean {
        return this._userFollowingService.isUserFollowing(user);
    }

    isUserLoading(userId: number): boolean {
        return this._userFollowingService.isUserLoading(userId.toString());
    }

    handleUserFollow(user: UserDto): void {
        if (this.isUserFollowing(user)) {
            this._userFollowingService.onUnFollowUser(user);
        } else {
            this._userFollowingService.onFollowUser(user);
        }
    }

    handleCloseModal(): void {
        this._modalRef.hide();
    }
}
