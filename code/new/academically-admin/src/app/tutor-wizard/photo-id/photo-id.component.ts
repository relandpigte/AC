import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { DocumentUploaderComponent } from '@app/_shared/components/document-uploader/document-uploader.component';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { BecomeATutorStep, FileParameter, PhotoIdVerificationDto, PhotoIdVerificationsServiceProxy, TutorWizardServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { BecomeATutorService } from '../_services/become-a-tutor.service';

@Component({
  selector: 'app-photo-id',
  templateUrl: './photo-id.component.html',
  styleUrls: ['./photo-id.component.less']
})
export class PhotoIdComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild(DocumentUploaderComponent) documentUploader: DocumentUploaderComponent;
  model: PhotoIdVerificationDto = new PhotoIdVerificationDto();
  photIdVerificationExtensions = fileUploadConfiguration.allowedImageExtensions;
  photoId: FileParameter;
  isLoading: boolean;

  constructor(
    injector: Injector,
    private _tutorWizardService: TutorWizardServiceProxy,
    private _photoIdVerificationsService: PhotoIdVerificationsServiceProxy,
    private _becomeATutorService: BecomeATutorService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getLatestPhotoIdVerification();
  }

  ngAfterViewInit(): void {
    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files && files.length) {
        this.photoId = files[0];
        this.model.photoIdUrl = URL.createObjectURL(this.photoId.data);
      } else {
        this.photoId = undefined;
        this.model.photoIdUrl = undefined;
      }
    });
  }

  onNextClick(): void {
    this.isLoading = true;
    const nextStep = BecomeATutorStep.Address;
    this._photoIdVerificationsService.create(this.photoId)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(() => {
        this._tutorWizardService.updateStep(nextStep)
          .pipe(
            takeUntil(this.destroyed$),
            finalize(() => {
              this.isLoading = false;
            }),
          )
          .subscribe(() => {
            this.notify.success(this.l('SavedSuccessfully'));
            this._becomeATutorService.currentStep = nextStep;
          });
      });
  }

  private getLatestPhotoIdVerification(): void {
    this._photoIdVerificationsService.getLatest()
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(photoIdVerification => {
        this.model = photoIdVerification;
      });
  }
}
