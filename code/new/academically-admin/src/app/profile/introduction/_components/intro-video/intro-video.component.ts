import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ProfileService } from '@app/profile/_services/profile.service';
import { DocumentUploaderComponent } from '@app/_shared/components/document-uploader/document-uploader.component';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { FileParameter, ProfilesServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';

@Component({
  selector: 'app-intro-video',
  templateUrl: './intro-video.component.html',
  styleUrls: ['./intro-video.component.less']
})
export class IntroVideoComponent extends AppComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent) documentUploader: DocumentUploaderComponent;

  user: UserDto;
  intorVideo: FileParameter;
  introVideoExtensions = fileUploadConfiguration.videoExtensions;
  isLoading = false;

  constructor(
    injector: Injector,
    private _profileService: ProfileService,
    private _profilesService: ProfilesServiceProxy,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
    this._profileService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit(): void {
  }

  onSaveClick(): void {
    this.isLoading = true;
    this._profilesService.updateIntroVideo(this.intorVideo)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(() => {
        this.intorVideo = undefined;
        this.getUser();
        this.notify.success(this.l('SavedSuccessfully'));
      });
  }

  onDeleteClick(): void {
    const options: ModalDialogOptions = {
      confirmCb: (): void => {
        this.isLoading = true;
        this._profilesService.deleteIntroVideo()
          .pipe(
            takeUntil(this.destroyed$),
            finalize(() => {
              this.isLoading = false;
            }),
          )
          .subscribe(() => {
            this.user.introVideoUrl = undefined;
            this._profileService.user = this.user;
            this.intorVideo = undefined;
            this.notify.success(this.l('SuccessfullyDeleted'));
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  onFilesChanged(files: FileParameter[]): void {
    if (files && files.length) {
      this.intorVideo = files[0];
    } else {
      this.intorVideo = undefined;
    }
  }

  private getUser(): void {
    this._profilesService.get(this.appSession.userId)
      .subscribe(user => {
        this._profileService.user = user;
      });
  }
}
