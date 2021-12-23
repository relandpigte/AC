import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { FileParameter } from '@shared/service-proxies/service-proxies';
import { ImageComponentContent } from '../../_models/image-component-content';

@Component({
  selector: 'app-image-component-editor',
  templateUrl: './image-component-editor.component.html',
  styleUrls: ['./image-component-editor.component.less']
})
export class ImageComponentEditorComponent implements OnInit {
  @Input() cropperAspectRationWidth = 1;
  @Input() cropperAspectRationHeight = 1;
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;

  allowedImageExtensions = fileUploadConfiguration.allowedImageExtensions;
  defaultFile: DefaultFile;
  imageComponentContent: ImageComponentContent = new ImageComponentContent();

  constructor() { }

  @Input() set component(value: ImageComponentContent) {
    this.documentUploader.files = [];
    this.documentUploader.defaultFile = undefined;
    this.imageComponentContent = value;
    if (this.imageComponentContent.imageName) {
      this.defaultFile = new DefaultFile();
      this.defaultFile.name = this.imageComponentContent.imageName;
      this.defaultFile.url = this.imageComponentContent.base64image;
      this.defaultFile.size = this.imageComponentContent.imageSize;
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
            self.imageComponentContent.base64image = reader.result as string;
            self.imageComponentContent.imageName = file.name;
            self.imageComponentContent.imageSize = file.size;
          });
        };
      } else {
        this.imageComponentContent.base64image = undefined;
        this.imageComponentContent.imageName = undefined;
        this.imageComponentContent.imageSize = undefined;
      }
    });

    this.documentUploader.defaultFileRemoved.subscribe(() => {
      this.imageComponentContent.base64image = undefined;
      this.imageComponentContent.imageName = undefined;
      this.imageComponentContent.imageSize = undefined;
    });

  }
}
