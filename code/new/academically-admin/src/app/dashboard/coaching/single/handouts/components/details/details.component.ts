import { Component, Injector, Input, OnInit } from '@angular/core';
import { ServicePresentationDto, VideoAttachmentDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';

@Component({
  selector: 'app-handouts-detail',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class HandoutsDetailsComponent extends AppComponentBase implements OnInit {
  @Input() isFirst: boolean;
  @Input() data: ServicePresentationDto;

  constructor(injector: Injector) {
    super(injector);
  }

  get fileType(): string { return this.data?.document?.originalFileName?.split('.')?.pop(); }
  get fileName(): string { return this.data?.document?.originalFileName; }
  get fileSize(): number { return this.data?.document?.size; }
  get getFileIcon(): string {
    if (fileUploadConfiguration.allowedImageExtensions.includes(this.fileType.replace(/^/, '.'))) {
      return '/assets/img/service/icons/image.svg';
    }
    if (fileUploadConfiguration.videoExtensions.includes(this.fileType.replace(/^/, '.'))) {
      return '/assets/img/service/icons/video.svg';
    }
    if (fileUploadConfiguration.docExtension.includes(this.fileType.replace(/^/, '.'))) {
      return '/assets/img/service/icons/document.svg';
    }
    return '/assets/img/service/icons/folder.svg';
  }

  ngOnInit(): void {
  }
}
