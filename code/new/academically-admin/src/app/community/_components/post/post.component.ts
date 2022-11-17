import { AfterViewInit, Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PostTabs } from '@app/community/_modals/add-post/add-post.component';
import { AppComponentBase } from '@shared/app-component-base';
import { TopicSorting } from '@shared/components/topic/topic.component';
import { DisciplineTaxonomiesServiceProxy, PostType } from '@shared/service-proxies/service-proxies';

import { takeUntil, finalize } from 'rxjs/operators';

export interface VisibilityOptions {
    label: string;
    value: any;
}

@Component({
    selector: 'app-community-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class CommunityPostComponent extends AppComponentBase implements OnInit, AfterViewInit {

    @ViewChild('topicEl') topicInput: ElementRef<HTMLElement>;

    @Input() type: PostTabs;
    @Output() onModelChange = new EventEmitter<any>();

    visibility: VisibilityOptions;
    visibilityOptions: VisibilityOptions[] = [];

    title: string;
    information: string;
    topic: string;
    topics: { id: string, name: string }[] = [];
    newTopics: { id: string, name: string }[] = [];

    model: any = {};

    availableTopics: any = [];
    isLoadingTopics = false;

    isShowHashtag = false;

    constructor(
        injector: Injector,
        private _taxonomyService: DisciplineTaxonomiesServiceProxy
    ) {
        super(injector);
    }

    get authorName(): string { return ([this.appSession.user.name, this.appSession.user.surname]).filter(n => n).join(' '); }
    get isTopicsOptional(): boolean { return this.type === PostTabs.QuickPost; }

    ngOnInit(): void {
        this.initVisibilityOptions();
        this.updateModel();
    }

    ngAfterViewInit(): void {
        this.topicInput.nativeElement.addEventListener('focus', () => this.isShowHashtag = true );
        this.topicInput.nativeElement.addEventListener('blur', () => this.isShowHashtag = false );
    }

    private initVisibilityOptions(): void {
        this.visibilityOptions = [
            { label: 'to everyone', value: null }
        ];
        this.visibility = this.visibilityOptions[0];
    }

    private getPostType(): PostType {
        switch(this.type) {
            case PostTabs.QuickPost:
                return PostType.QuickPost;
            case PostTabs.AddQuestion:
                return PostType.Question;
            default:
                return PostType.Discussion;
        }
    }

    onTopicsKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Enter') {
          e.preventDefault();
          const idx = this.topics.findIndex(i => i.name.trim() === this.topic.trim());
          if (idx < 0) {
            this.topics.push({ id: null, name: this.topic.trim() });
            this.newTopics.push({ id: null, name: this.topic.trim() });
            this.topic = undefined;
          }
          this.updateModel();
        }
    }

    onSelectExistingTopic(topic: any): void {
        this.topics.push(topic);
        this.updateModel();
    }

    onRemoveTopicClick(topic: any): void {
        const idx = this.topics.findIndex(e => e.name === topic.name);
        const newIdx = this.topics.findIndex(e => e.name === topic.name);
        if (idx >= 0) this.topics.splice(idx, 1);
        if (newIdx >= 0) this.newTopics.splice(newIdx, 1);
        this.updateModel();
    }

    updateModel(): void {
        this.model.title = this.title;
        this.model.information = this.information;
        this.model.visibility = this.visibility.value;
        this.model.type = this.getPostType();
        this.model.topics = this.topics.filter(t => t.id).map(t => t.id) ?? [];
        this.model.newTopics = this.newTopics.map(t => t.name);
        this.onModelChange.emit(this.model);
    }

    loadTopics(data: any): void {
        const { keyword, showLoading } = data;
        this.isLoadingTopics = showLoading;
        this._taxonomyService.getAllLastChildren(keyword, true, TopicSorting.Popular)
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.isLoadingTopics = false))
            .subscribe(topics => this.availableTopics = topics.filter(t => !this.topics.some(x => x.id === t.id)));
    }
}
