import { Component, OnInit, Injector, Output, EventEmitter, inject } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UserPublicationDto, UserPublicationsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-create-edit-publication',
  templateUrl: './create-edit-publication.component.html',
  styleUrls: ['./create-edit-publication.component.less']
})
export class CreateEditPublicationComponent extends AppComponentBase implements OnInit {
  @Output() onSave = new EventEmitter<any>();
  id: string;
  userId: number;
  isSaving = false;
  publication: UserPublicationDto = new UserPublicationDto();
  summaryMaxWordCount = 1500;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _userPublicationService: UserPublicationsServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    if (!this.id) {
    } else {
      this.getPublication();
    }
  }

  onFormSubmit(): void {
    this.isSaving = true;
    const publicationSubscription = this.id ?
      this._userPublicationService.update(this.publication) :
      this._userPublicationService.create(this.publication);
    publicationSubscription.subscribe(result => {
      this.notify.success(this.l('SavedSuccessfully'));
      this.isSaving = false;
      this.onSave.emit();
      this.close();
    });
  }

  onCloseClick(): void {
    this.close();
  }

  onKeyup(summary: string): void {
    if (summary) {
      const words = summary.match(/\S+/g).length;
      if (words > this.summaryMaxWordCount) {
        const trimmed = summary.split(/\s+/, this.summaryMaxWordCount).join(' ');
        this.publication.summary = trimmed + ' ';
      }
    }
  }

  getSummaryWordCount(): number {
    const wordCount = this.publication.summary ? this.publication.summary.match(/\S+/g).length : 0;
    if (wordCount > this.summaryMaxWordCount) {
      return this.summaryMaxWordCount;
    }
    return wordCount;
  }

  private close(): void {
    this._modal.hide();
  }

  private getPublication(): void {
    this._userPublicationService.get(this.id)
      .subscribe((publication) => {
        this.publication = publication;
      });
  }
}
