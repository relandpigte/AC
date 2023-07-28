import { ChangeDetectorRef, Component, Injector, Input, OnChanges, OnInit, SimpleChanges, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';

import { AppComponentBase } from '@shared/app-component-base';
import { PostDto, PostType, SharedType } from '@shared/service-proxies/service-proxies';
import { FileUtils } from '@shared/helpers/file-utils';
import { DisciplineTaxonomyDto } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';

@Component({
  selector: 'app-preview-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PreviewPostsComponent extends AppComponentBase implements OnInit, OnChanges {
  readonly showMoreLimit: number = 255;

  @Input() data: PostDto;
  @Input() file: File;
  @Input() canRemove: boolean;

  @Output() onRemove: EventEmitter<any> = new EventEmitter<any>();
  showMore = false;
  fileAttachment: File;

  constructor(injector: Injector, private _cdr: ChangeDetectorRef) {
    super(injector);
  }

  get title(): string { return this.data?.title; }
  get description(): string { return this.data?.content; }
  get postDate(): string { return this.postDateFormat(this.data?.creationTime); }
  get author(): string { return this.data?.creatorUser?.fullName; }
  get userTopics(): DisciplineTaxonomyDto[] { return this.data?.postTopics?.map?.(t => t.disciplineTaxonomy); }
  get hasSharedService(): boolean { return this.data?.sharedId && this.data?.sharedType === SharedType.Service; }
  get sharedService(): any { return ServiceCardUtils.getServiceData(this.data); }

  get isShowMore(): boolean {
    return this.description?.length > this.showMoreLimit;
  }

  ngOnInit(): void {}

  removePost(): void {
    this.onRemove.emit();
  }

  handlePostRedirection(event: Event): void {
    const element = (event.target as HTMLElement).tagName.toLowerCase();
    switch (element) {
      case 'span':
      case 'div': {
        const redirection = PostType.Discussion === this.data?.type ? 'discussion' : 'post';
        const url = `${AppConsts.appBaseUrl}/app/community/${redirection}/${this.data?.id}`;
        window.open(url, '_blank');
        break;
      }
      default:
        break;
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    if ('data' in changes && this.data) {
      await this.getFileAttachment();
    }
  }

  private async getFileAttachment() {
    if (!this.data.postAttachments) {
      return;
    }
    const [file] = this.data.postAttachments;
    if (!file) {
      return;
    }
    const document = file.document;
    if (!document) {
      return;
    }
    this.fileAttachment = await FileUtils.getFileBlob(file.documentUrl, document.name, document.fileType);
    this._cdr.detectChanges();
  }

  private postDateFormat(postDate: any): string {
    if (!postDate) {
      return;
    }
    const time = moment(postDate);
    if (time.isSame(new Date(), 'day')) {
      return time.format('h:mm a');
    } else {
      return time.format('MMM D, YYYY h:mm a');
    }
  }
}
