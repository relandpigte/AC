import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BecomeATutorStep, TutorWizardServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { BecomeATutorService } from '../_services/become-a-tutor.service';
import { ResearchComponent as UserResearchComponent } from '../../profile/research/research.component';
import { AppSessionService } from '@shared/session/app-session.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.less']
})
export class ResearchComponent extends AppComponentBase {
  @ViewChild('userResearch') userResearch: UserResearchComponent;
  isLoading = false;
  userId: number;
  isReadOnly = false;

  constructor(
    injector: Injector,
    private _router: Router,
    private _becomeATutorService: BecomeATutorService,
    private _tutorWizardService: TutorWizardServiceProxy,
    private _appSession: AppSessionService
  ) {
    super(injector);
    this._becomeATutorService.userId$.subscribe(userId => {
      this.userId = userId ?? this._appSession.userId;
      this.isReadOnly = (this.userId !== this._appSession.userId);
    });
  }

  get isNextEnabled(): boolean {
    return this.userResearch?.interests?.userResearchInterests?.length > 0
      || this.userResearch?.methodologies?.userResearchMethodologies?.length > 0
      || this.userResearch?.publications?.userPublications?.length > 0;
  }

  onNextClick(): void {
    this.isLoading = true;
    this._tutorWizardService.updateStep(BecomeATutorStep.Research)
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

  onNavigateNextScreen(): void {
    this._router.navigate([`app/tutor-applications/${this.userId}/languages`]);
  }

  onBackClick(): void {
    if (this.isReadOnly) {
      this._router.navigate([`app/tutor-applications/${this.userId}/education`]);
    } else {
      this._router.navigate([`app/tutor-wizard/education`]);
    }
  }

  private updateNextStep(): void {
    this.isLoading = true;
    const nextStep = BecomeATutorStep.Languages;
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

}
