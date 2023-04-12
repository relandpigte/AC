import { ChangeDetectorRef, Component, Injector, Input, OnChanges, OnInit, SimpleChanges, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';

import { AppComponentBase } from '@shared/app-component-base';
import { PostDto } from '@shared/service-proxies/service-proxies';
import { FileUtils } from '@shared/helpers/file-utils';
import { DisciplineTaxonomyDto } from '@shared/service-proxies/service-proxies';

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
  title: string;
  description: string;
  author: string;
  postDate: string;
  fileAttachment: File;

  userTopics: DisciplineTaxonomyDto[];

  constructor(injector: Injector, private _cdr: ChangeDetectorRef) {
    super(injector);
  }

  get isShowMore(): boolean {
    return this.description?.length > this.showMoreLimit;
  }

  ngOnInit(): void {
    if (!this.data) {
      return;
    }

    this.title        = this.data.title;
    this.description  = this.data.content;
    this.postDate     = this.postDateFormat(this.data.creationTime);
    this.author       = this.data.creatorUser?.fullName;
    this.userTopics   = this.data.postTopics?.map?.(t => t.disciplineTaxonomy);
  }

  removePost(): void {
    this.onRemove.emit();
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
    const time = moment(postDate);
    if (time.isSame(new Date(), 'day')) {
      return time.format('h:mm a');
    } else {
      return time.format('MMM D, YYYY h:mm a');
    }
  }
}
