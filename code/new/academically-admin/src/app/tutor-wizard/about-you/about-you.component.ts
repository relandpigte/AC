import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { AboutYouDto, BecomeATutorStep, TutorWizardServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { BecomeATutorService } from '../_services/become-a-tutor.service';

@Component({
  selector: 'app-about-you',
  templateUrl: './about-you.component.html',
  styleUrls: ['./about-you.component.less']
})
export class AboutYouComponent extends AppComponentBase implements OnInit {
  model: AboutYouDto = new AboutYouDto();
  isLoading = false;

  constructor(
    injector: Injector,
    private _tutorWizardService: TutorWizardServiceProxy,
    private _router: Router,
    private _becomeATutorService: BecomeATutorService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getAboutYou();
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

  private getAboutYou(): void {
    this.isLoading = true;
    this._tutorWizardService.getAboutYou()
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(aboutYou => {
        this.model = aboutYou;
      })
  }
}
