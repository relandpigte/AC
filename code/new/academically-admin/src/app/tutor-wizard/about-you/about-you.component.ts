import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { AboutYouDto, BecomeATutorStep, DeclineTutorVerificationStepDto, TutorApplicationServiceProxy, TutorVerificationStepDto, TutorWizardServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { TutorWizardStepDeclinedComponent } from '../_components/tutor-wizard-step-declined/tutor-wizard-step-declined.component';
import { BecomeATutorService } from '../_services/become-a-tutor.service';

@Component({
  selector: 'app-about-you',
  templateUrl: './about-you.component.html',
  styleUrls: ['./about-you.component.less']
})
export class AboutYouComponent extends AppComponentBase implements OnInit {
  model: AboutYouDto = new AboutYouDto();
  isLoading = false;
  userId: number;
  tutorVerificationStep: TutorVerificationStepDto;
  isReadOnly = false;
  isDeclining = false;
  isApproving = false;

  constructor(
    injector: Injector,
    private _tutorWizardService: TutorWizardServiceProxy,
    private _router: Router,
    private _modalService: BsModalService,
    private _tutorApplicationService: TutorApplicationServiceProxy,
    private _becomeATutorService: BecomeATutorService,
    private _appSession: AppSessionService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._becomeATutorService.userId$.subscribe(userId => {
      this.userId = userId;
      this.getAboutYou();
      this.isReadOnly = (this.userId !== this._appSession.userId);
    });

    this._becomeATutorService.currentTutorWizardStep$
    .pipe( takeUntil(this.destroyed$))
    .subscribe(step => {
      this.tutorVerificationStep = step;
      if (this.isReadOnly && this.tutorVerificationStep.step !== BecomeATutorStep.AboutYou) {
        this._tutorApplicationService.getStep(step.tutorVerificationId, BecomeATutorStep.AboutYou).subscribe(result => {
          this.tutorVerificationStep = result;
        });
      }
    });
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this._tutorWizardService.updateAboutYou(this.model)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        const nextStep = BecomeATutorStep.Education;
        this._tutorWizardService.updateStep(nextStep)
          .subscribe((result) => {
            this.notify.success(this.l('SavedSuccessfully'));
            this._becomeATutorService.currentStep = nextStep;
            this._becomeATutorService.currentTutorWizardStep = result;
          });
      });
  }

  onCancelClick(): void {
    this.message.confirm(
      this.l('CancelTutorWizardMessage'),
      undefined,
      (result: boolean) => {
        if (result) {
          this._router.navigate(['/app/home']);
        }
      }
    );
  }

  onNavigateNextScreen(): void {
    this._router.navigate([`app/tutor-applications/${this.userId}/education`]);
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

  private getAboutYou(): void {
    this.isLoading = true;
    this.userId = this.userId ? this.userId : this._appSession.user.id;
    this._tutorWizardService.getAboutYou(this.userId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(aboutYou => {
        this.model = aboutYou;
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
