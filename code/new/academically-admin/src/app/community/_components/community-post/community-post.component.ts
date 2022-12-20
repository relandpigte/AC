
import { Component, Injector, OnInit, OnChanges, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { FileUtils } from '@shared/helpers/file-utils';
import { AvailableServiceDto, DisciplineTaxonomyDto, PostType } from '@shared/service-proxies/service-proxies';

import * as moment from 'moment';

@Component({
    selector: 'app-community-post-card',
    templateUrl: './community-post.component.html',
    styleUrls: ['./community-post.component.scss']
})
export class CommunityPostCardComponent extends AppComponentBase implements OnInit, OnChanges {

    @Input() data: any;

    fileAttachment: File;
    serviceAttachment: AvailableServiceDto;
    userTopics: DisciplineTaxonomyDto[];

    constructor(
        injector: Injector,
        private _cdr: ChangeDetectorRef
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

    get isQuickPost(): boolean { return this.data?.type === PostType.QuickPost; }
    get isQuestion(): boolean { return this.data?.type === PostType.Question; }
    get isDiscussion(): boolean { return this.data?.type === PostType.Discussion; }

    ngOnInit(): void {
    }

    async ngOnChanges(changes: SimpleChanges) {
        if ('data' in changes && this.data) {
            this.userTopics = this.data.postTopics?.map?.(t => t.disciplineTaxonomy);
            await this.getFileAttachment();
            this.getServiceAttachment();
        }
    }

    private async getFileAttachment() {
        if (this.data.postAttachments) {
            const [file] = this.data.postAttachments;
            if (file) {
                const document = file.document;
                if (document) {
                    this.fileAttachment = await FileUtils.getFileBlob(file.documentUrl, document.name, document.fileType);
                    this._cdr.detectChanges();
                }
            }
        }
    }

    private getServiceAttachment() {
        if (this.data.service) {
            this.serviceAttachment = this.data.service;
        }
    }
}
