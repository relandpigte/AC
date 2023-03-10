import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { UploadService } from '@app/_shared/services/upload.service';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { CreateEventResourceDto, DocumentType, EventResourcesServiceProxy, EventResourceType, FileParameter } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-upload-handout',
  templateUrl: './upload-handout.component.html',
  styleUrls: ['./upload-handout.component.less']
})
export class UploadHandoutComponent extends AppComponentBase implements OnInit {
  @Input() workshopId: string;
  @Output() modelSaved = new EventEmitter();

  model = new CreateEventResourceDto();
  isLoading = false;
  allowedHandoutsExtension = fileUploadConfiguration.allowedFileExtensions;
  document: FileParameter;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _workshopResourcesService: EventResourcesServiceProxy,
    private _uploadService: UploadService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this.model.eventId = this.workshopId;
    this.model.type = EventResourceType.Handout;
    this._workshopResourcesService.create(this.model)
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
