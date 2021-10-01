import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BecomeATutorStep, TutorApplicationServiceProxy, TutorVerificationStepDto, TutorWizardServiceProxy, TutorVerificationStepStatus } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { BecomeATutorService } from '../_services/become-a-tutor.service';
import { ResearchComponent as UserResearchComponent } from '../../profile/research/research.component';
import { AppSessionService } from '@shared/session/app-session.service';
import { Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { TutorWizardStepDeclinedComponent } from '../_components/tutor-wizard-step-declined/tutor-wizard-step-declined.component';
@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.less']
})
export class ResearchComponent extends AppComponentBase {
  @ViewChild('userResearch') userResearch: UserResearchComponent;
  isLoading = false;
  userId: number;
  isReadOnly = false;
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
    private _becomeATutorService: BecomeATutorService,
    private _tutorWizardService: TutorWizardServiceProxy,
    private _tutorApplicationService: TutorApplicationServiceProxy,
    private _appSession: AppSessionService
  ) {
    super(injector);
    this._becomeATutorService.userId$.subscribe(userId => {
      this.userId = userId ?? this._appSession.userId;
      this.isReadOnly = (this.userId !== this._appSession.userId);

    });
    this._becomeATutorService.currentTutorWizardStep$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(step => {
      this.tutorVerificationStep = step;

      if (this.isReadOnly && this.tutorVerificationStep.step !== BecomeATutorStep.Research) {
        this._tutorApplicationService.getStep(step.tutorVerificationId, BecomeATutorStep.Research).subscribe(result => {
          this.tutorVerificationStep = result;
        });
      }
      if (this.isReadOnly) {
        this._tutorApplicationService.getPreviousStep(step.tutorVerificationId, BecomeATutorStep.Research).subscribe(result => {
          this.tutorVerificationPrevStep = result;
        });

        this._tutorApplicationService.getNextStep(step.tutorVerificationId, BecomeATutorStep.Research).subscribe(result => {
          this.tutorVerificationNextStep = result;
        });
      }
    });
  }

  get isNextEnabled(): boolean {
    return this.userResearch?.interests?.userResearchInterests?.length > 0
      || this.userResearch?.methodologies?.userResearchMethodologies?.length > 0
      || this.userResearch?.publications?.userPublications?.length > 0;
  }

  onNextClick(): void {
    this.isLoading = true;
    this._tutorWizardService.updateStep(BecomeATutorStep.Research)
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
      this._router.navigate([`app/tutor-applications/${this.userId}/languages`]);
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
      this._router.navigate([`app/tutor-applications/${this.userId}/education`]);
    } else {
      this._router.navigate([`app/tutor-wizard/education`]);
    }
  }

  private updateNextStep(): void {
    this.isLoading = true;
    const nextStep = BecomeATutorStep.Languages;
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
