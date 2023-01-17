import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { TopicSorting } from '@shared/components/topic/topic.component';
import { PostTabs } from '@shared/modals/upsert-post/upsert-post.component';
import { DisciplineTaxonomiesServiceProxy, KeywordSearchStrategy, PostType } from '@shared/service-proxies/service-proxies';

import { finalize, takeUntil } from 'rxjs/operators';

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

    @ViewChild('topicEl') topicInput: ElementRef<HTMLElement>;

    @Input() type: PostTabs;
    @Output() onModelChange = new EventEmitter<any>();

    visibility: VisibilityOptions;
    visibilityOptions: VisibilityOptions[] = [];

    @Input() title: string;
    @Input() information: string;

    topicsChoices: any[] = [];
    selectedTopics: { id: string, name: string }[] = [];
    newSelectedTopics: { id: string, name: string }[] = [];
    isLoadingTopics = false;

    @Input() model: any = {};

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
        this.model = this.model ? this.model : {};

        if (this.model.id != null) {
            this.updateFields();
        } else {
            this.updateModel();
        }
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

    updateFields(): void {
        this.title = this.model.title
        this.information = this.model.content;
        this.visibility.value = this.model.visibility;
        this.selectedTopics = this.model.postTopics.map(e => { return { id: e.disciplineTaxonomy.id, name: e.disciplineTaxonomy.name }});
    }

    updateModel(): void {
        this.model.title = this.title;
        this.model.information = this.information;
        this.model.visibility = this.visibility.value;
        this.model.type = this.getPostType();
        this.model.topics = this.selectedTopics.filter(t => t.id).map(t => t.id) ?? [];
        this.model.newTopics = this.newSelectedTopics.map(t => t.name);
        this.onModelChange.emit(this.model);
    }

    handleTopicsModelUpdate(data: any): void {
        const { selected, newSelected } = data;
        this.selectedTopics = selected;
        this.newSelectedTopics = newSelected;
        this.updateModel();
    }

    handleTopicsKeywordUpdate(data: any): void {
        const { keyword, showLoading } = data;
        this.isLoadingTopics = showLoading;
        this._taxonomyService.getAllLastChildren(keyword, KeywordSearchStrategy.StartsWith, true, TopicSorting.Popular, undefined)
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.isLoadingTopics = false))
            .subscribe(topics => this.topicsChoices = topics.filter(t => !this.selectedTopics.some(x => x.id === t.id)));
    }
}
