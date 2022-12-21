import { Location } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { DisciplineTaxonomyDto, PostDto, PostsServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-discussion',
    templateUrl: './discussion.component.html',
    styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent extends AppComponentBase implements OnInit {
    private discussion: PostDto;

    discussionTopics: DisciplineTaxonomyDto[];

    isLoadingPost = false;

    constructor(
        injector: Injector,
        private _location: Location,
        private _route: ActivatedRoute,
        private _postsService: PostsServiceProxy
    ) {
        super(injector);
        this._route.paramMap.subscribe(paramMap => {
            if (paramMap.has('id')) {
                this.loadDiscussion(paramMap.get('id'));
            }
        });
    }

    get isLoading(): boolean { return this.isLoadingPost; }
    get discussionTitle(): string { return this.discussion?.title; }
    get discussionDescription(): string { return this.discussion?.content; }

    ngOnInit(): void {
    }

    private loadDiscussion(id: string): void {
        this.isLoadingPost = true;
        this._postsService.get(id)
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.isLoadingPost = false))
            .subscribe(async post => {
                this.discussion = post;
                this.discussionTopics = post.postTopics?.map?.(t => t.disciplineTaxonomy);
            });
    }

    navigateBack(): void {
        this._location.back();
    }
}
