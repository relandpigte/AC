import { Component, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ImageCropperComponent as ImageCopper } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.less']
})
export class ImageCropperComponent extends AppComponentBase {
  @Input() image: File;
  @Input() aspectRatioWidth = 1;
  @Input() aspectRationHeight = 1;
  @Input() maintainAspectRatio = false;
  @Output() imageCropped = new EventEmitter<File>();
  @Output() imageLoaded = new EventEmitter();
  @ViewChild('imageCropper') imageCropper: ImageCopper;
  isImageCropping = false;

  constructor(
    injector: Injector,
    private _modalRef: BsModalRef,
  ) {
    super(injector);
  }

  close(): void {
    this.isImageCropping = false;
    this._modalRef.hide();
  }

  onCloseClick(): void {
    this.close();
  }

  onCropClick(): void {
    this.isImageCropping = true;
    setTimeout(() => {
      const croppedImage = this.imageCropper.crop();
      const imageFile = this.base64ToFile(croppedImage.base64, this.image.name);
      if (this.validateFileSize(imageFile.size)) {
        this.imageCropped.emit(imageFile);
      }
      else {
        this.isImageCropping = false;
      }
    }, 0);
  }

  onImageLoaded(): void {
    this.imageLoaded.emit();
  }

  private base64ToFile(dataurl: string, filename: string): File {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  private validateFileSize(size: number) {
    const isValid = size <= fileUploadConfiguration.maxFileSize;
    if (!isValid) {
      this.notify.error(this.l('InvalidFileSizeUploadError', '1MB'), this.l('InvalidFileUploadError'));
    }
    return isValid;
  }
}
