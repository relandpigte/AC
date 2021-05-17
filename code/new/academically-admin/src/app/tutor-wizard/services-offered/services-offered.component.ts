import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BecomeATutorStep, TutorWizardServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { BecomeATutorService } from '../_services/become-a-tutor.service';

@Component({
  selector: 'app-services-offered',
  templateUrl: './services-offered.component.html',
  styleUrls: ['./services-offered.component.less']
})
export class ServicesOfferedComponent extends AppComponentBase {
  isLoading = false;

  constructor(
    injector: Injector,
    private _tutorWizardService: TutorWizardServiceProxy,
    private _becomeATutorService: BecomeATutorService,
  ) {
    super(injector);
  }

  onNextClick(): void {
    this.isLoading = true;
    const nextStep = BecomeATutorStep.ProfilePicture;
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
  }
}
