import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { TopicOptions } from '../topic/topic.component';

@Component({
    selector: 'app-card-cluster',
    templateUrl: './card-cluster.component.html',
    styleUrls: ['./card-cluster.component.scss'],
    animations: [appModuleAnimation()]
})
export class CardClusterComponent extends AppComponentBase {

    @Input() data: any[];
    @Input() isParent = false;
    @Input() templateRef: any;
    @Input() gap: number = 0;
    @Input() isLoading = false;
    @Input() topicOptions: TopicOptions;

    @Output() onTopicClick: EventEmitter<any> = new EventEmitter();
    @Output() onTopicFollow: EventEmitter<any> = new EventEmitter();
    @Output() onTopicUnfollow: EventEmitter<any> = new EventEmitter();
    @Output() onTopicRemove: EventEmitter<any> = new EventEmitter();

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    handleTopicClick(topic: any): void { this.onTopicClick.emit(topic); }
    handleTopicFollowClick(topic: any): void { this.onTopicFollow.emit(topic); }
    handleTopicUnfollowClick(topic: any): void { this.onTopicUnfollow.emit(topic); }
    handleTopicRemoveClick(topic: any): void { this.onTopicRemove.emit(topic); }
}
