import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { BecomeATutorStep, TutorApplicationServiceProxy, TutorVerificationStepDto, TutorVerificationStepStatus, TutorWizardServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { TutorWizardStepDeclinedComponent } from '../_components/tutor-wizard-step-declined/tutor-wizard-step-declined.component';
import { BecomeATutorService } from '../_services/become-a-tutor.service';

type NewType = TutorVerificationStepDto;

@Component({
  selector: 'app-declaration',
  templateUrl: './declaration.component.html',
  styleUrls: ['./declaration.component.less']
})
export class DeclarationComponent extends AppComponentBase {
  model = {
    declaration1: false,
    declaration2: false,
    declaration3: false,
    declaration4: false,
    declaration5: false,
    declaration6: false,
    declaration7: false,
    declaration8: false,
    declaration9: false,
    declaration10: false,
  };
  isLoading = false;
  userId: number;
  isReadOnly: boolean;
  tutorVerificationStep: TutorVerificationStepDto;
  isDeclining = false;
  isApproving = false;
  tutorVerificationStepStatus = TutorVerificationStepStatus;
  tutorVerificationPrevStep: TutorVerificationStepDto;

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: BsModalService,
    private _tutorApplicationService: TutorApplicationServiceProxy,
    private _becomeATutorService: BecomeATutorService,
    private _tutorWizardService: TutorWizardServiceProxy,
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

      if (this.isReadOnly && this.tutorVerificationStep.step !== BecomeATutorStep.Declaration) {
        this._tutorApplicationService.getStep(step.tutorVerificationId, BecomeATutorStep.Declaration).subscribe(result => {
          this.tutorVerificationStep = result;
        });
      }
      if(this.isReadOnly){
        this._tutorApplicationService.getPreviousStep(step.tutorVerificationId, BecomeATutorStep.Declaration).subscribe(result => {
          this.tutorVerificationPrevStep = result;
        });
      }
    });
    this._becomeATutorService.currentTutorWizardStep$.subscribe(result => {
      this.model = {
        declaration1: result.status === TutorVerificationStepStatus.Saved,
        declaration2: result.status === TutorVerificationStepStatus.Saved,
        declaration3: result.status === TutorVerificationStepStatus.Saved,
        declaration4: result.status === TutorVerificationStepStatus.Saved,
        declaration5: result.status === TutorVerificationStepStatus.Saved,
        declaration6: result.status === TutorVerificationStepStatus.Saved,
        declaration7: result.status === TutorVerificationStepStatus.Saved,
        declaration8: result.status === TutorVerificationStepStatus.Saved,
        declaration9: result.status === TutorVerificationStepStatus.Saved,
        declaration10: result.status === TutorVerificationStepStatus.Saved
      }
    });
  }

  onNextClick(): void {
    this.isLoading = true;
    this._tutorWizardService.updateStep(BecomeATutorStep.Declaration)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(() => {
        this.updateNext();
      });
  }


  onBackClick(): void {
    if (this.isReadOnly) {
      this._router.navigate([`app/tutor-applications/${this.userId}/privacy-policy`]);
    } else {
      this._router.navigate([`app/tutor-wizard/privacy-policy`]);
    }
  }

  onNavigateNextScreen(): void {
    this._router.navigate([`app/tutor-applications`]);
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

  private showDeclinedModal(model: NewType): void {
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

  private updateNext(): void {
    this.isLoading = true;
    const nextStep = BecomeATutorStep.CompleteApplication;
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

  allDeclarationsChecked(): boolean {
    return this.model.declaration1 && this.model.declaration2 && this.model.declaration3
      && this.model.declaration4 && this.model.declaration5 && this.model.declaration6
      && this.model.declaration7 && this.model.declaration8 && this.model.declaration9
      && this.model.declaration10;
  }
}
