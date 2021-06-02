import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BecomeATutorStep, TutorWizardServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { BecomeATutorService } from '../_services/become-a-tutor.service';

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

  constructor(
    injector: Injector,
    private _becomeATutorService: BecomeATutorService,
    private _tutorWizardService: TutorWizardServiceProxy,
  ) {
    super(injector);
  }

  onNextClick(): void {
    this.isLoading = true;
    const nextStep = BecomeATutorStep.CompleteApplication;
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

  allDeclarationsChecked(): boolean {
    return this.model.declaration1 && this.model.declaration2 && this.model.declaration3
      && this.model.declaration4 && this.model.declaration5 && this.model.declaration6
      && this.model.declaration7 && this.model.declaration8 && this.model.declaration9
      && this.model.declaration10;
  }
}
