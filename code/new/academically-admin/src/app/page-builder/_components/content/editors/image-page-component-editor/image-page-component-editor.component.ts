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
  @Input() pageComponent: ImagePageComponent;
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;

  allowedImageExtensions = fileUploadConfiguration.allowedImageExtensions;
  defaultFile: DefaultFile;

  constructor() { }

  ngOnInit(): void {
    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files && files.length) {
        const self = this;
        const file = files[0].data as File;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          setTimeout(() => {
            self.pageComponent.base64image = reader.result as string;
            self.pageComponent.imageName = file.name;
            self.pageComponent.imageSize = file.size;
          });
        };
      } else {
        this.pageComponent.base64image = undefined;
        this.pageComponent.imageName = undefined;
        this.pageComponent.imageSize = undefined;
      }
    });

    if (this.pageComponent.imageName) {
      this.defaultFile = new DefaultFile();
      this.defaultFile.name = this.pageComponent.imageName;
      this.defaultFile.url = this.pageComponent.base64image;
      this.defaultFile.size = this.pageComponent.imageSize;
      this.documentUploader.defaultFile = this.defaultFile;
    }
  }
}
