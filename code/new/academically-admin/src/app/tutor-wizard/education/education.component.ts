import { Component, Injector, ViewChild } from '@angular/core';
import { EducationsComponent } from '@app/profile/education/_components/educations/educations.component';
import { AppComponentBase } from '@shared/app-component-base';
import { BecomeATutorStep, TutorWizardServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { BecomeATutorService } from '../_services/become-a-tutor.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.less']
})
export class EducationComponent extends AppComponentBase {
  @ViewChild('educations') educations: EducationsComponent;
  isLoading = false;

  constructor(
    injector: Injector,
    private _becomeATutorService: BecomeATutorService,
    private _tutorWizardService: TutorWizardServiceProxy,
  ) {
    super(injector);
  }

  onNextClick(): void {
    this.isLoading = true;
    this._tutorWizardService.updateStep(BecomeATutorStep.Education)
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
    this.isLoading = true;
    const nextStep = BecomeATutorStep.Research;
    this._tutorWizardService.updateStep(nextStep)
    .pipe(
      takeUntil(this.destroyed$),
      finalize(() => {
        this.isLoading = false;
      }),
    )
    .subscribe((result) => {
      this.notify.success(this.l('SavedSuccessfully'));
      this._becomeATutorService.currentStep = result.step;
      this._becomeATutorService.currentTutorWizardStep = result;
    });
  }
}
