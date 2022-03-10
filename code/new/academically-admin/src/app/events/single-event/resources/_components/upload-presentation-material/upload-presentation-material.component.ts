import { Component, OnInit, Injector, Output, EventEmitter, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { EventResourcesServiceProxy, CreateEventResourceDto, FileParameter, DocumentType, EventDto, EventResourceType } from '@shared/service-proxies/service-proxies';
import { UploadService } from '@app/_shared/services/upload.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-upload-presentation-material',
  templateUrl: './upload-presentation-material.component.html',
  styleUrls: ['./upload-presentation-material.component.less']
})
export class UploadPresentationMaterialComponent extends AppComponentBase implements OnInit {
  @Input() eventId: string;
  @Output() modelSaved = new EventEmitter();

  model = new CreateEventResourceDto();
  allowedPresentationMaterialExtension: string[];
  isLoading = false;
  document: FileParameter;

  EventResourceType = EventResourceType;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _eventResourcesService: EventResourcesServiceProxy,
    private _uploadService: UploadService,
  ) {
    super(injector);
  }

  ngOnInit() {
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onTypeClick(type: EventResourceType): void {
    this.model.type = type;
    if (type === EventResourceType.Slides) {
      this.allowedPresentationMaterialExtension = fileUploadConfiguration.powerPointExtensions;
    } else {
      this.allowedPresentationMaterialExtension = fileUploadConfiguration.videoExtensions;
    }
  }

  onBackClick(): void {
    this.model.type = undefined;
    this.allowedPresentationMaterialExtension = undefined;
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this.model.eventId = this.eventId;
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

  onFilesChange(files: FileParameter[]): void {
    if (files && files.length) {
      this.document = files[0];
    } else {
      this.document = undefined;
    }
  }
}
