import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BecomeATutorStep, TutorWizardServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { BecomeATutorService } from '../_services/become-a-tutor.service';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.less']
})
export class ResearchComponent extends AppComponentBase {
  isLoading = false;

  constructor(
    injector: Injector,
    private _becomeATutorService: BecomeATutorService,
    private _tutorWizardService: TutorWizardServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }


  onNextClick(): void {
    this.isLoading = true;
    const nextStep = BecomeATutorStep.ServicesOffered;
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
