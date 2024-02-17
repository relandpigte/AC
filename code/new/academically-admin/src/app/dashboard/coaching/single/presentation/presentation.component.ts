import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { DefaultFile, DocumentUploaderComponent } from '@app/_shared/components/document-uploader/document-uploader.component';
import { AppComponentBase } from '@shared/app-component-base';
import { DocumentDto, FileParameter, ServicePresentationDto, ServicesServiceProxy, ServicesType } from '@shared/service-proxies/service-proxies';


@Component({
  selector: 'app-coaching-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.less']
})
export class PresentationComponent extends AppComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;
  id: string;
  defaultFile: DefaultFile;
  attachments: ServicePresentationDto[] = [];

  allowedExtensions = [...fileUploadConfiguration.videoExtensions, ...fileUploadConfiguration.allowedFileExtensions];
  document = new DocumentDto();
  isLoading = false;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
    this.id = route.snapshot.paramMap.get('id');
  }

  get isAttachments(): boolean { return this.attachments?.length > 0; }

  ngOnInit(): void {
    this.getAllServicePresentations();
  }

  onFileChanged(files: FileParameter[]): void {
    if (!files) return;

    this.isLoading = true;
    const file = files.pop();
    this._servicesService.saveServicePresentation(this.id, ServicesType.Coaching, [file])
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(() => this.getAllServicePresentations());
  }

  private getAllServicePresentations(): void {
    this._servicesService.getAllServicePresentation(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(attachments => this.attachments = attachments);
  }
}
