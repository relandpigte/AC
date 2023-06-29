import { Component, ElementRef, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { finalize, take } from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap/modal';

import { ImageCropperComponent } from '@app/_shared/components/image-cropper/image-cropper.component';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { FileParameter, ProfilesServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';

@Component({
  selector: 'app-profile-picture-changer',
  templateUrl: './profile-picture-changer.component.html',
  styleUrls: ['./profile-picture-changer.component.less']
})
export class ProfilePictureChangerComponent extends AppComponentBase {
  @Input() user: UserDto = new UserDto();
  @Output() profilePictureUpdated = new EventEmitter<string>(null);
  @ViewChild('profilePictureInput', { static: true }) profilePictureInput: ElementRef;
  fileUploadSettings = fileUploadConfiguration;
  isRemoving = false;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _profilesService: ProfilesServiceProxy,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
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
            this.profilePictureUpdated.emit(profilePictureUrl);
            this.notify.success(this.l('ProfilePictureUploadedMessage'));
            modal.hide();
          });
      });
    }
  }

  onRemoveClick(): void {
    const options: ModalDialogOptions = {
      title: undefined,
      text: this.l('ProfilePictureRemoveMessage'),
      confirmCb: (): void => {
        this.isRemoving = true;
        this._profilesService.deleteProfilePicture()
          .subscribe(() => {
            this.profilePictureUpdated.emit(undefined);
            this.notify.success(this.l('ProfilePictureRemovedMessage'));
            this.isRemoving = false;
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }
}
