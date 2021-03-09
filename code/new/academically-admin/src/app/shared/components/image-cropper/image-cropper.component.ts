import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ImageCropperComponent as ImageCopper } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.less']
})
export class ImageCropperComponent {
  @Input() image: File;
  @Output() imageCropped = new EventEmitter<File>();
  @ViewChild('imageCropper') imageCropper: ImageCopper;
  isImageCropping = false;

  constructor(
    private _modalRef: BsModalRef,
  ) {

  }

  onCloseClick(): void {
    this._modalRef.hide();
  }

  onCropClick(): void {
    this.isImageCropping = true;
    const croppedImage = this.imageCropper.crop();
    this.imageCropped.emit(this.base64ToFile(croppedImage.base64, this.image.name));
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
}
