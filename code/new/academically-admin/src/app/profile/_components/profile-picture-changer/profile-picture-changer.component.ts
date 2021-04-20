import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { ProfileService } from '@app/profile/_services/profile.service';
import { ImageCropperComponent } from '@app/_shared/components/image-cropper/image-cropper.component';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { uiEvents } from '@shared/constants/ui-events.constant';
import { FileParameter, ProfilesServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-profile-picture-changer',
  templateUrl: './profile-picture-changer.component.html',
  styleUrls: ['./profile-picture-changer.component.less']
})
export class ProfilePictureChangerComponent extends AppComponentBase {
  fileUploadSettings = fileUploadConfiguration;
  @ViewChild('profilePictureInput', { static: true }) profilePictureInput: ElementRef;
  user: UserDto;
  isRemoving = false;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _profileService: ProfileService,
    private _profilesService: ProfilesServiceProxy,
  ) {
    super(injector);
    this._profileService.user$.subscribe(user => {
      this.user = user;
    });
  }

  onUploadProfilePictureClick(): void {
    this.profilePictureInput.nativeElement.click();
  }

  onProfilePictureChange(files: FileList): void {
    if (files && files.length > 0) {
      const modalSettings = this.defaultModalSettings;
      modalSettings.initialState = {
        image: files[0],
        aspectRatioWidth: 1,
        aspectRationHeight: 1,
        maintainAspectRatio: true,
      };
      const modal = this._modalService.show(ImageCropperComponent, modalSettings);
      const imageCropper: ImageCropperComponent = modal.content;
      imageCropper.imageCropped.subscribe((file: File) => {
        const profilePicture: FileParameter = {
          fileName: file.name,
          data: file,
        }
        this._profilesService.updateProfilePicture(profilePicture)
          .subscribe(profilePictureUrl => {
            this.user.profilePictureUrl = profilePictureUrl;
            this._profileService.user = this.user;
            abp.event.trigger(uiEvents.profileDetailsUpdated, profilePictureUrl);
            this.notify.success(this.l('ProfilePictureUploadedMessage'));
            modal.hide();
          });
      });
    }
  }

  onRemoveClick(): void {
    this.message.confirm(
      undefined,
      undefined,
      (result: boolean) => {
        if (result) {
          this.isRemoving = true;
          this._profilesService.deleteProfilePicture()
            .subscribe(() => {
              delete this.user.profilePictureUrl;
              this._profileService.user = this.user;
              abp.event.trigger(uiEvents.profileDetailsUpdated, undefined);
              this.notify.success(this.l('ProfilePictureRemovedMessage'));
              this.isRemoving = false;
            });
        }
      }
    );
  }
}
