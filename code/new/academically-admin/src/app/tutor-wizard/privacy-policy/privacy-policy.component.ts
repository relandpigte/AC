import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AcceptanceLogDto, AcceptanceLogsServiceProxy, AcceptanceType, BecomeATutorStep, TutorWizardServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { BecomeATutorService } from '../_services/become-a-tutor.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.less']
})
export class PrivacyPolicyComponent extends AppComponentBase implements OnInit {
  isLoading = false;
  isAccepted = false;
  acceptanceDto = new AcceptanceLogDto();

  constructor(
    injector: Injector,
    private _becomeATutorService: BecomeATutorService,
    private _tutorWizardService: TutorWizardServiceProxy,
    private _acceptanceLogsService: AcceptanceLogsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getAcceptanceLog();
  }

  onPrint(): void {
    const printWindow = window.open('', 'PRINT', 'height=1000,width=1300');

    printWindow.document.write('<html><head><title>' + document.title + '</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write('<h1>' + document.title + '</h1>');
    printWindow.document.write(document.getElementById('print-section').innerHTML);
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
    this._acceptanceLogsService.accept(AcceptanceType.PrivacyPolicy)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(() => {
        this.updateCurrentStep();
      });
  }

  private updateCurrentStep(): void {
    this.isLoading = true;
    this._tutorWizardService.updateStep(BecomeATutorStep.PrivacyPolicy)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(() => {
        this.nextStep();
      });
  }

  private nextStep(): void {
    this.isLoading = true;
    const nextStep = BecomeATutorStep.Declaration;
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
    this._acceptanceLogsService.getLatest(AcceptanceType.PrivacyPolicy)
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
}
