import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { DefaultFile, DocumentUploaderComponent } from '@app/_shared/components/document-uploader/document-uploader.component';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { BecomeATutorStep, FileParameter, PhotoIdVerificationsServiceProxy, TutorWizardServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { BecomeATutorService } from '../_services/become-a-tutor.service';

@Component({
  selector: 'app-photo-id',
  templateUrl: './photo-id.component.html',
  styleUrls: ['./photo-id.component.less']
})
export class PhotoIdComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild(DocumentUploaderComponent) documentUploader: DocumentUploaderComponent;
  photIdVerificationExtensions = fileUploadConfiguration.allowedImageExtensions;
  photoId: FileParameter;
  defaultFile: DefaultFile;
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
      } else {
        this.photoId = undefined;
      }
    });
    this.documentUploader.defaultFileRemoved.subscribe(() => {
      this.defaultFile = undefined;
    });
  }

  onNextClick(): void {
    this.isLoading = true;
    if (!this.defaultFile) {
      this._photoIdVerificationsService.create(this.photoId)
        .pipe(
          takeUntil(this.destroyed$),
        )
        .subscribe(() => {
          this.updateCurrentStep();
        });
    } else {
      this.updateCurrentStep();
    }
  }

  private getLatestPhotoIdVerification(): void {
    this.isLoading = true;
    this._photoIdVerificationsService.getLatest()
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(photoIdVerification => {
        if (photoIdVerification && photoIdVerification.document) {
          this.defaultFile = new DefaultFile();
          this.defaultFile.name = photoIdVerification.document.originalFileName;
          this.defaultFile.url = photoIdVerification.photoIdUrl;
          this.defaultFile.size = photoIdVerification.document.size;
          this.documentUploader.defaultFile = this.defaultFile;
        }
      });
  }

  private updateCurrentStep(): void {
    this._tutorWizardService.updateStep(BecomeATutorStep.PhotoId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(() => {
        this.updateStep();
      });
  }

  private updateStep(): void {
    const nextStep = BecomeATutorStep.Address;
    this._tutorWizardService.updateStep(nextStep)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe((result) => {
        this.notify.success(this.l('SavedSuccessfully'));
        this._becomeATutorService.currentStep = nextStep;
        this._becomeATutorService.currentTutorWizardStep = result;
      });
  }
}
