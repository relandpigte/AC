
import { Component, Injector, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DisciplineTaxonomyDto } from '@shared/service-proxies/service-proxies';

import * as moment from 'moment';

@Component({
    selector: 'app-community-post-card',
    templateUrl: './community-post.component.html',
    styleUrls: ['./community-post.component.scss']
})
export class CommunityPostCardComponent extends AppComponentBase implements OnInit, OnChanges {

    @Input() data: any;

    userTopics: DisciplineTaxonomyDto[];

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    get posterName(): string { return this.data.creatorUser?.fullName ?? 'Anonymous'; }
    get postDate(): string {
        const time = moment(this.data.creationTime);
        if (time.isSame(new Date(), 'day'))
            return time.format('h:mm a');
        else
            return time.format('MMM D, YYYY h:mm a');
    }

    get title(): string { return this.data.title; }
    get description(): string { return this.data.content; }
    get isOwner(): boolean {
        return this.appSession.userId === this.data?.creatorUserId;
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('data' in changes && this.data) {
            this.userTopics = this.data.postTopics?.map?.(t => t.disciplineTaxonomy);
        }
    }
}
