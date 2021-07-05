import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { AboutYouDto, BecomeATutorStep, TutorWizardServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
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
  userId: number;
  isReadOnly = false;

  constructor(
    injector: Injector,
    private _tutorWizardService: TutorWizardServiceProxy,
    private _router: Router,
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
}
