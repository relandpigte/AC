import { Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { uiEvents } from '@shared/constants/ui-events.constant';
import { BecomeATutorStep, ProfilesServiceProxy, TutorApplicationServiceProxy, TutorVerificationStepDto, TutorWizardServiceProxy, UserDto, TutorVerificationStepStatus } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { TutorWizardStepDeclinedComponent } from '../_components/tutor-wizard-step-declined/tutor-wizard-step-declined.component';
import { BecomeATutorService } from '../_services/become-a-tutor.service';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.less']
})
export class ProfilePictureComponent extends AppComponentBase implements OnInit {
  @Input() userId: number;
  isReadOnly = false;
  user: UserDto = new UserDto();
  isLoading = false;
  tutorVerificationStep: TutorVerificationStepDto;
  isDeclining = false;
  isApproving = false;
  tutorVerificationStepStatus = TutorVerificationStepStatus;
  tutorVerificationPrevStep: TutorVerificationStepDto;
  tutorVerificationNextStep: TutorVerificationStepDto;

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: BsModalService,
    private _tutorApplicationService: TutorApplicationServiceProxy,
    private _profilesService: ProfilesServiceProxy,
    private _tutorWizardService: TutorWizardServiceProxy,
    private _becomeATutorService: BecomeATutorService,
  ) {
    super(injector);

    this._becomeATutorService.userId$.subscribe(userId => {
      this.userId = userId ?? this.appSession.userId;
      this.isReadOnly = (this.userId !== this.appSession.userId);
    });
    this._becomeATutorService.currentTutorWizardStep$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(step => {
      this.tutorVerificationStep = step;

      if (this.isReadOnly && this.tutorVerificationStep.step !== BecomeATutorStep.ProfilePicture) {
        this._tutorApplicationService.getStep(step.tutorVerificationId, BecomeATutorStep.ProfilePicture).subscribe(result => {
          this.tutorVerificationStep = result;
        });
      }
      if (this.isReadOnly) {
        this._tutorApplicationService.getPreviousStep(step.tutorVerificationId, BecomeATutorStep.ProfilePicture).subscribe(result => {
          this.tutorVerificationPrevStep = result;
        });

        this._tutorApplicationService.getNextStep(step.tutorVerificationId, BecomeATutorStep.ProfilePicture).subscribe(result => {
          this.tutorVerificationNextStep = result;
        });
      }
    });
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this._profilesService.get(this.userId)
      .subscribe(user => {
        this.user = user;
      });
  }

  onProfilePictureUpdated(profilePictureUrl: string): void {
    this.user.profilePictureUrl = profilePictureUrl;
    abp.event.trigger(uiEvents.profileDetailsUpdated, profilePictureUrl);
  }

  onNextClick(): void {
    this.isLoading = true;
    this._tutorWizardService.updateStep(BecomeATutorStep.ProfilePicture)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(() => {
        this.updateNextStep();
      });
  }

  onNavigateNextScreen(): void {
    if (this.tutorVerificationNextStep?.status === TutorVerificationStepStatus.Saved) {
      this._router.navigate([`app/tutor-applications/${this.userId}/photo-id`]);
    }
  }

  onStatusChange(event: any): void {
    const isApproved = event.target.value === 'approved';
    if (isApproved) {
      this.isApproving = true;
      this._tutorWizardService.approve(this.tutorVerificationStep.id)
        .subscribe(() => {
          this.getPendingStep();
        });
    } else {
      event.preventDefault();
      this.showDeclinedModal(this.tutorVerificationStep);
    }
  }

  onBackClick(): void {
    if (this.isReadOnly) {
      const link = `app/tutor-applications/${this.userId}/services-offered`;
      this._router.navigate([link]);
    } else {
      this._router.navigate([`app/tutor-wizard/services-offered`]);
    }
  }

  private updateNextStep(): void {
    this.isLoading = true;
    const nextStep = BecomeATutorStep.PhotoId;
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

  private getPendingStep(): void {
    this._tutorWizardService.getPendingStep(this.userId)
    .pipe(
      takeUntil(this.destroyed$),
      finalize(() => this.isApproving = false)
    )
    .subscribe(result => {
      this._becomeATutorService.currentStep = result.step;
      this._becomeATutorService.currentTutorWizardStep = result;
      this.onNavigateNextScreen();
    });
  }

  private showDeclinedModal(model: TutorVerificationStepDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<TutorWizardStepDeclinedComponent>;
    modalSettings.initialState = {
      model: model,
    };
    const modal = this._modalService.show(TutorWizardStepDeclinedComponent, modalSettings).content;
    modal.modelSaved
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(() => {
        this.getPendingStep();
      });
  }
}
