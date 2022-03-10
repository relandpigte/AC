import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { CreateEventResourceDto, EventResourcesServiceProxy, FileParameter, DocumentType, EventResourceType } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { takeUntil, finalize } from 'rxjs/operators';
import { UploadService } from '@app/_shared/services/upload.service';

@Component({
  selector: 'app-upload-handout',
  templateUrl: './upload-handout.component.html',
  styleUrls: ['./upload-handout.component.less']
})
export class UploadHandoutComponent extends AppComponentBase implements OnInit {
  @Input() eventId: string;
  @Output() modelSaved = new EventEmitter();

  model = new CreateEventResourceDto();
  isLoading = false;
  allowedHandoutsExtension = fileUploadConfiguration.allowedFileExtensions;
  document: FileParameter;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _eventResourcesService: EventResourcesServiceProxy,
    private _uploadService: UploadService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this.model.eventId = this.eventId;
    this.model.type = EventResourceType.Handout;
    this._eventResourcesService.create(this.model)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._uploadService.upload(this.document.data, DocumentType.EventResource, response.id)
          .pipe(
            takeUntil(this.destroyed$),
            finalize(() => {
              this.isLoading = false;
            })
          )
          .subscribe(() => {
            this.modelSaved.emit();
            this.notify.success(this.l('SavedSuccessfully'));
            this._modal.hide();
          });
      });
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onFilesChange(files: FileParameter[]): void {
    if (files && files.length) {
      this.document = files[0];
    } else {
      this.document = undefined;
    }
  }
}
