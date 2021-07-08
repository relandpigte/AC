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
      this.resizeImage(imageFile, croppedImage.width, croppedImage.height).then(imageBlob => {
        const resizedImage = new File([imageBlob], this.image.name, { type: this.image.type });
        if (this.validateFileSize(resizedImage.size)) {
          this.imageCropped.emit(resizedImage);
        }
        else {
          this.isImageCropping = false;
        }
      });
    }, 0);
  }

  onImageLoaded(): void {
    this.imageLoaded.emit();
  }

  private base64ToFile(dataurl: string, filename: string): File {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  private resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
    const resizePercentage = 33;
    maxWidth = maxWidth - ((maxWidth * resizePercentage) / 100);
    maxHeight = maxHeight - ((maxHeight * resizePercentage) / 100);
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        const width = image.width;
        const height = image.height;

        let newWidth: number;
        let newHeight: number;

        if (width > height) {
          newHeight = height * (maxWidth / width);
          newWidth = maxWidth;
        } else {
          newWidth = width * (maxHeight / height);
          newHeight = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;

        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, newWidth, newHeight);
        canvas.toBlob(resolve, file.type);
      };
      image.onerror = reject;
    });
  }

  private validateFileSize(size: number) {
    const isValid = size <= fileUploadConfiguration.maxFileSize;
    if (!isValid) {
      this.notify.error(this.l('InvalidFileSizeUploadError', '5MB'), this.l('InvalidFileUploadError'));
    }
    return isValid;
  }
}
