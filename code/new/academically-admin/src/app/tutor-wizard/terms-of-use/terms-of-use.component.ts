import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { AcceptanceLogDto, AcceptanceLogsServiceProxy, AcceptanceType, BecomeATutorStep, TutorApplicationServiceProxy, TutorVerificationStepDto, TutorWizardServiceProxy, TutorVerificationStepStatus } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { TutorWizardStepDeclinedComponent } from '../_components/tutor-wizard-step-declined/tutor-wizard-step-declined.component';
import { BecomeATutorService } from '../_services/become-a-tutor.service';

@Component({
  selector: 'app-terms-of-use',
  templateUrl: './terms-of-use.component.html',
  styleUrls: ['./terms-of-use.component.less']
})
export class TermsOfUseComponent extends AppComponentBase implements OnInit {
  isLoading = false;
  isAccepted = false;
  acceptanceDto = new AcceptanceLogDto();
  userId: number;
  isReadOnly: boolean;
  tutorVerificationStep: TutorVerificationStepDto;
  isDeclining = false;
  isApproving = false;
  tutorVerificationStepStatus = TutorVerificationStepStatus;

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: BsModalService,
    private _tutorApplicationService: TutorApplicationServiceProxy,
    private _becomeATutorService: BecomeATutorService,
    private _tutorWizardService: TutorWizardServiceProxy,
    private _acceptanceLogsService: AcceptanceLogsServiceProxy,
    private _appSession: AppSessionService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._becomeATutorService.userId$.subscribe(userId => {
      this.userId = userId ?? this._appSession.userId;
      this.isReadOnly = (this.userId !== this._appSession.userId);
      this.getAcceptanceLog();
    });
    this._becomeATutorService.currentTutorWizardStep$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(step => {
      this.tutorVerificationStep = step;

      if (this.isReadOnly && this.tutorVerificationStep.step !== BecomeATutorStep.TermsOfUse) {
        this._tutorApplicationService.getStep(step.tutorVerificationId, BecomeATutorStep.TermsOfUse).subscribe(result => {
          this.tutorVerificationStep = result;
        });
      }
    });
  }

  onPrint(): void {
    var printWindow = window.open('', 'PRINT', 'height=1000,width=1300');

    printWindow.document.write('<html><head><title>' + document.title + '</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write('<h1>' + document.title + '</h1>');
    printWindow.document.write(document.getElementById("print-section").innerHTML);
    printWindow.document.write('</body></html>');

    printWindow.document.close(); // necessary for IE >= 10
    printWindow.focus(); // necessary for IE >= 10*/

    printWindow.print();
  }

  onNextClick(): void {
    if (!this.isAccepted) {
      return;
    }

    this.isLoading = true;
    this._acceptanceLogsService.accept(AcceptanceType.TermsOfUse)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(() => {
        this.nextStep()
      });
  }

  onNavigateNextScreen(): void {
    this._router.navigate([`app/tutor-applications/${this.userId}/declaration`]);
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
      this._router.navigate([`app/tutor-applications/${this.userId}/dbs-check`]);
    } else {
      this._router.navigate([`app/tutor-wizard/dbs-check`]);
    }
  }


  private nextStep(): void {
    this.isLoading = true;
    this._tutorWizardService.updateStep(BecomeATutorStep.TermsOfUse)
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

  private updateNextStep(): void {
    this.isLoading = true;
    const nextStep = BecomeATutorStep.PrivacyPolicy;
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

  private getAcceptanceLog(): void {
    this.isLoading = true;
    this._acceptanceLogsService.getLatest(AcceptanceType.TermsOfUse, this.userId)
    .pipe(
      takeUntil(this.destroyed$),
      finalize(() => {
        this.isLoading = false;
      }),
    )
    .subscribe((result) => {
      this.acceptanceDto = result;
      this.isAccepted = result != null && result.id != null;
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
