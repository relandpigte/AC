import { Component, OnInit, Injector, Output, EventEmitter, inject } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GetPublicationDto, UserPublicationsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-create-edit-publication',
  templateUrl: './create-edit-publication.component.html',
  styleUrls: ['./create-edit-publication.component.less']
})
export class CreateEditPublicationComponent extends AppComponentBase implements OnInit  {
  @Output() onSave = new EventEmitter<any>();
  id: string;
  userId: number;
  isSaving = false;
  publication: GetPublicationDto = new GetPublicationDto();
  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _userPublicationService: UserPublicationsServiceProxy
  ) {
    super(injector);
   }

  ngOnInit(): void {
    if (!this.id) {
      this.publication.userId = this.userId;
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
    const words = summary.match(/\S+/g).length;
    if (words > 1500) {
      const trimmed = summary.split(/\s+/, 1500).join(' ');
      this.publication.summary = trimmed + ' ';
    }
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
