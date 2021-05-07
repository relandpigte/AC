import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ImageCropperComponent as ImageCopper } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.less']
})
export class ImageGalleryComponent extends AppComponentBase implements OnInit {
  @Output() imageCropped = new EventEmitter<File>();
  @ViewChild('imageCropper') imageCropper: ImageCopper;
  imageRoot = AppConsts.appBaseUrl + '/assets/img/cover-photos/';
  images: string[] = [
    'pexels-aleksandar-pasaric-2341830.jpg',
    'pexels-alex-andrews-1983038.jpg',
    'pexels-carlos-oliva-3586966.jpg',
    'pexels-francesco-ungaro-2325446.jpg',
    'pexels-mack-kamp-1449455.jpg',
    'pexels-magda-ehlers-1279813.jpg',
    'pexels-philippe-donn-1114690.jpg',
    'pexels-pixabay-262713.jpg',
    'pexels-riccardo-bertolo-4245826.jpg',
    'pexels-toni-cuenca-585752.jpg',
  ];
  selectedImage: string;
  selectedImageFile: File;
  isLoading = false;
  isImageCropping = false;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.selectedImage = this.images[0];
    this.setSelectedImageFile();
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onCropClick(): void {
    this.isImageCropping = true;
    setTimeout(() => {
      const croppedImage = this.imageCropper.crop();
      this.imageCropped.emit(this.base64ToFile(croppedImage.base64, this.selectedImage));
    }, 0);
  }

  onImageClick(image: string): void {
    this.selectedImage = image;
    this.setSelectedImageFile();
  }

  private setSelectedImageFile(): void {
    this.isLoading = true;
    const imageUrl = this.imageRoot + this.selectedImage;
    fetch(imageUrl)
      .then(e => e.blob())
      .then(blob => {
        this.selectedImageFile = new File([blob], this.selectedImage, {
          type: 'image/jpeg'
        });
        this.isLoading = false;
      });
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
