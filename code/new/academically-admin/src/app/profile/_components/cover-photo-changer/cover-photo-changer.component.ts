import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { ProfileService } from '@app/profile/_services/profile.service';
import { ImageCropperComponent } from '@app/_shared/components/image-cropper/image-cropper.component';
import { ImageGalleryComponent } from '@app/_shared/components/image-gallery/image-gallery.component';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { FileParameter, ProfilesServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { takeUntil } from '@node_modules/rxjs/operators';

@Component({
  selector: 'app-cover-photo-changer',
  templateUrl: './cover-photo-changer.component.html',
  styleUrls: ['./cover-photo-changer.component.less']
})
export class CoverPhotoChangerComponent extends AppComponentBase {
  @ViewChild('coverPhotoInput', { static: true }) coverPhotoInput: ElementRef;
  fileUploadSettings = fileUploadConfiguration;
  user: UserDto;
  isRemovingCoverPhoto = false;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _profileService: ProfileService,
    private _profilesService: ProfilesServiceProxy,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
    this._profileService.user$.subscribe(user => {
      this.user = user;
    });
  }

  onUploadCoverPhotoClick(): void {
    this.coverPhotoInput.nativeElement.click();
  }

  onBrowseGalleryClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ImageGalleryComponent>;
    modalSettings.class = 'modal-lg';
    const modal = this._modalService.show(ImageGalleryComponent, modalSettings);
    const imageCropper = modal.content
    imageCropper.imageCropped.subscribe((file: File) => {
      const coverPhoto: FileParameter = {
        fileName: file.name,
        data: file,
      };
      this._profilesService.updateCoverPhoto(coverPhoto)
        .subscribe(coverPhotoUrl => {
          this.user.coverPhotoUrl = coverPhotoUrl;
          this._profileService.user = this.user;
          this.appSession.user.coverPictureUrl = coverPhotoUrl;
          this.notify.success(this.l('CoverPhotoUploadedMessage'));
          modal.hide();
        });
    });
  }

  onCoverPhotoChange(files: FileList): void {
    if (files && files.length > 0) {
      const modalSettings = this.defaultModalSettings;
      modalSettings.initialState = {
        image: files[0],
        aspectRatioWidth: 1440,
        aspectRationHeight: 300,
        maintainAspectRatio: true,
      };
      const modal = this._modalService.show(ImageCropperComponent, modalSettings);
      const imageCropper: ImageCropperComponent = modal.content;
      imageCropper.imageCropped.subscribe((file: File) => {
        const coverPhoto: FileParameter = {
          fileName: file.name,
          data: file,
        };
        this._profilesService.updateCoverPhoto(coverPhoto)
          .subscribe(coverPhotoUrl => {
            this.user.coverPhotoUrl = coverPhotoUrl;
            this._profileService.user = this.user;
            this.appSession.user.coverPictureUrl = coverPhotoUrl;
            this.notify.success(this.l('CoverPhotoUploadedMessage'));
            modal.hide();
          });
      });
    }
  }

  onRemoveCoverPhoto(): void {
    const options: ModalDialogOptions = {
      title: undefined,
      text: undefined,
      confirmCb: (): void => {
        this.isRemovingCoverPhoto = true;
        this._profilesService.deleteCoverPhoto()
          .subscribe(() => {
            delete this.user.coverPhotoUrl;
            delete this.appSession.user.coverPictureUrl;
            this._profileService.user = this.user;
            this.notify.success(this.l('CoverPhotoRemovedMessage'));
            this.isRemovingCoverPhoto = false;
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }
}
