import { ChangeDetectorRef, Component, OnInit, Injector, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/app-component-base';
import { PostTabs } from '@app/community/_modals/add-post/add-post.component';

export interface VisibilityOptions {
    label: string;
    value: any;
}

@Component({
    selector: 'app-community-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class CommunityPostComponent extends AppComponentBase implements OnInit {

    @Input() type: PostTabs;

    visibility: VisibilityOptions;
    visibilityOptions: VisibilityOptions[] = [];

    title: string;
    information: string;
    topic: string;
    topics: string[] = [];

    model: any = {};

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    get authorName(): string { return ([this.appSession.user.name, this.appSession.user.surname]).filter(n => n).join(' '); }
    get isTopicsOptional(): boolean { return this.type === PostTabs.QuickPost; }

    ngOnInit(): void {
        this.initVisibilityOptions();
    }

    private initVisibilityOptions(): void {
        this.visibilityOptions = [
            { label: 'to everyone', value: null }
        ];
        this.visibility = this.visibilityOptions[0];
    }

    onTopicsKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Enter') {
          e.preventDefault();
          const idx = this.topics.findIndex(i => i.trim() === this.topic.trim());
          if (idx < 0) {
            this.topics.push(this.topic.trim());
            this.topic = undefined;
          }
          this.updateModelTopics();
        }
    }

    onRemoveTopicClick(topic: string): void {
        const idx = this.topics.findIndex(e => e === topic);
        if (idx >= 0) this.topics.splice(idx, 1);
        this.updateModelTopics();
    }

    updateModelTopics(): void {
        this.model.topics = this.topics.join(',');
    }
}
