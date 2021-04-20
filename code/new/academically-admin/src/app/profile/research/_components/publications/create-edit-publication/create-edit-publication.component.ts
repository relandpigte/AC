import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PublicationTagDto, PublicationType, UserPublicationDto, UserPublicationsServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Observer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-publication',
  templateUrl: './create-edit-publication.component.html',
  styleUrls: ['./create-edit-publication.component.less']
})
export class CreateEditPublicationComponent extends AppComponentBase implements OnInit {
  @Output() userPublicationSaved = new EventEmitter();
  userPublication: UserPublicationDto;
  isLoading = false;
  publicationTagsTypeaheadSource: Observable<PublicationTagDto[]>;
  publicationTag = '';
  publicationDate: Date;
  datePickerConfig: BsDatepickerConfig;
  PublicationType = PublicationType;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _userPublicationsService: UserPublicationsServiceProxy,
  ) {
    super(injector);
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  ngOnInit(): void {
    this.getPublicationTags();
    if (!this.userPublication) {
      this.userPublication = new UserPublicationDto();
      this.userPublication.tags = [];
    } else {
      if (this.userPublication.userPublicationTags && this.userPublication.userPublicationTags.length > 0) {
        this.userPublication.tags = this.userPublication.userPublicationTags
          .map(userPublicationTag => userPublicationTag.publicationTag.name);
      }
      this.publicationDate = this.userPublication.publicationDate.toDate();
    }
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this.userPublication.publicationDate = moment(this.publicationDate);
    (this.userPublication.id
      ? this._userPublicationsService.update(this.userPublication)
      : this._userPublicationsService.create(this.userPublication))
      .subscribe(() => {
        this.notify.success(this.l('SuccessfullySaved'));
        this.isLoading = false;
        this.userPublicationSaved.emit();
        this._modal.hide();
      });
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onPublicationTagSelect(publicationTag: PublicationTagDto): void {
    this.addTagToUserPublication(publicationTag.name);
  }

  onRemovePublicationTagClick(tag: string): void {
    const index = this.userPublication.tags.findIndex(e => e == tag);
    if (index > -1) {
      this.userPublication.tags.splice(index, 1);
    }
  }

  onPublicationTagKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (this.publicationTag) {
        this.addTagToUserPublication(this.publicationTag);
      }
    }
  }

  private getPublicationTags(): void {
    this.publicationTagsTypeaheadSource = new Observable((observer: Observer<string>) => {
      observer.next(this.publicationTag);
    }).pipe(
      switchMap((query: string) => {
        return this._userPublicationsService.getTags(query);
      })
    );
  }

  private addTagToUserPublication(tag: string): void {
    if (!this.userPublication.tags.includes(tag.toLowerCase())) {
      this.userPublication.tags.push(tag.toLowerCase());
    }
    this.publicationTag = '';
  }
}
