import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ShortNumPipe } from '@shared/pipes/short-num.pipe';
import { UserTopicType } from '@shared/service-proxies/service-proxies';

export interface TopicOptions {
    showFollow?: boolean;
    showRemove?: boolean;
};

export enum TopicSorting {
    ForYou = 'foryou',
    Popular = 'popular',
    Recent = 'recent'
};

@Component({
    selector: 'app-topic-card',
    templateUrl: './topic.component.html',
    styleUrls: ['./topic.component.scss'],
    animations: [appModuleAnimation()],
    providers: [ ShortNumPipe ]
})
export class TopicCardComponent extends AppComponentBase {

    @Input() data: any;
    @Input() isParent = false;
    @Input() customClass = '';
    @Input() showFollow: boolean;
    @Input() showRemove: boolean;
    @Input() lazyLoadFollowerCount: boolean;
    @Input() isLoading = true;

    @Output() onClick: EventEmitter<any> = new EventEmitter();
    @Output() onFollow: EventEmitter<any> = new EventEmitter();
    @Output() onUnfollow: EventEmitter<any> = new EventEmitter();
    @Output() onRemove: EventEmitter<any> = new EventEmitter();

    followerCount: number;

    get name(): string { return this.data?.name; }
    get composition(): string { return this._snPipe.transform(this.data?.children?.length ?? 0, 1); }
    get followers(): string { return this._snPipe.transform(this.data?.followerCount ?? 0, 1); }
    get isFollowed(): boolean { return this.data?.userTopics?.some(u => u.userId === this.appSession.userId && u.type === UserTopicType.Following); }

    constructor(
        injector: Injector,
        private _snPipe: ShortNumPipe
    ) {
        super(injector);
    }


    handleTopicClick(): void { this.onClick.emit(this.data); }
    handleFollowClick(): void { this.onFollow.emit(this.data); }
    handleUnfollowClick(): void { this.onUnfollow.emit(this.data); }
    handleRemoveClick(): void { this.onRemove.emit(this.data); }
}
