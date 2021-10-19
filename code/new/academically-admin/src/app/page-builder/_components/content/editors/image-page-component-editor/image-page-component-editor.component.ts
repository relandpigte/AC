import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ImagePageComponent } from '@app/page-builder/_models/image-page-component';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import { FileParameter } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-image-page-component-editor',
  templateUrl: './image-page-component-editor.component.html',
  styleUrls: ['./image-page-component-editor.component.less']
})
export class ImagePageComponentEditorComponent implements OnInit {
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;

  allowedImageExtensions = fileUploadConfiguration.allowedImageExtensions;
  defaultFile: DefaultFile;
  imagePageComponent: ImagePageComponent = new ImagePageComponent();

  constructor() { }

  @Input() set pageComponent(value: ImagePageComponent) {
    this.documentUploader.files = [];
    this.documentUploader.defaultFile = undefined;
    this.imagePageComponent = value;
    if (this.imagePageComponent.imageName) {
      this.defaultFile = new DefaultFile();
      this.defaultFile.name = this.imagePageComponent.imageName;
      this.defaultFile.url = this.imagePageComponent.base64image;
      this.defaultFile.size = this.imagePageComponent.imageSize;
      this.documentUploader.defaultFile = this.defaultFile;
    }
  }

  ngOnInit(): void {
    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files && files.length) {
        const self = this;
        const file = files[0].data as File;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          setTimeout(() => {
            self.imagePageComponent.base64image = reader.result as string;
            self.imagePageComponent.imageName = file.name;
            self.imagePageComponent.imageSize = file.size;
          });
        };
      } else {
        this.imagePageComponent.base64image = undefined;
        this.imagePageComponent.imageName = undefined;
        this.imagePageComponent.imageSize = undefined;
      }
    });

    this.documentUploader.defaultFileRemoved.subscribe(() => {
      this.imagePageComponent.base64image = undefined;
      this.imagePageComponent.imageName = undefined;
      this.imagePageComponent.imageSize = undefined;
    });

  }
}
