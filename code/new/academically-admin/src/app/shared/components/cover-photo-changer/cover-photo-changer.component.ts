import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { ImageCropperComponent } from '../image-cropper/image-cropper.component';
import { FileParameter, ProfilesServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { ProfileService } from '@shared/services/profile.service';

@Component({
  selector: 'app-cover-photo-changer',
  templateUrl: './cover-photo-changer.component.html',
  styleUrls: ['./cover-photo-changer.component.less']
})
export class CoverPhotoChangerComponent extends AppComponentBase {
  user: UserDto;
  fileUploadSettings = fileUploadConfiguration;
  @ViewChild('coverPhotoInput', { static: true }) coverPhotoInput: ElementRef;
  isRemovingCoverPhoto = false;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _profileService: ProfileService,
    private _profilesService: ProfilesServiceProxy,
  ) {
    super(injector);
    this._profileService.$user.subscribe(user => {
      this.user = user;
    });
  }

  onUploadCoverPhotoClick(): void {
    this.coverPhotoInput.nativeElement.click();
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
        }
        this._profilesService.updateCoverPhoto(coverPhoto)
          .subscribe(coverPhotoUrl => {
            this.user.coverPhotoUrl = coverPhotoUrl;
            this._profileService.user = this.user;
            this.notify.success('Your cover photo was uploaded.');
            modal.hide();
          });
      });
    }
  }

  onRemoveCoverPhoto(): void {
    this.isRemovingCoverPhoto = true;
    this._profilesService.deleteCoverPhoto()
      .subscribe(() => {
        delete this.user.coverPhotoUrl;
        this._profileService.user = this.user;
        this.notify.success('Your cover photo was removed.');
        this.isRemovingCoverPhoto = false;
      });
  }
}
