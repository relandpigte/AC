import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { BecomeATutorStep, TutorVerificationStepDto, TutorWizardServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { BecomeATutorService } from './_services/become-a-tutor.service';

@Component({
  selector: 'app-tutor-wizard',
  templateUrl: './tutor-wizard.component.html',
  styleUrls: ['./tutor-wizard.component.less'],
  animations: [appModuleAnimation()],
})
export class TutorWizardComponent extends AppComponentBase implements OnInit {
  BecomeATutorStep = BecomeATutorStep;
  activeStep: BecomeATutorStep;
  currentStep: TutorVerificationStepDto = new TutorVerificationStepDto();
  steps: TutorVerificationStepDto[] = [];

  constructor(
    injector: Injector,
    private _becomeATutorService: BecomeATutorService,
    private _tutorWizardServiceProxy: TutorWizardServiceProxy,
    private _router: Router,
    private _route: ActivatedRoute,
  ) {
    super(injector);
    this._route.data
      .pipe(
        takeUntil(this.destroyed$),
      ).subscribe(data => {
        this.currentStep = data.currentStep as TutorVerificationStepDto;
        this.navigateToStep();
      });
    this._becomeATutorService.currentTutorWizardStep$
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(currentStep => {
        if (currentStep !== null && currentStep !== undefined) {
          this.currentStep = currentStep;
          this.getAllSteps();
          this.navigateToStep();
        }
      });

    this.getAllSteps();
  }

  ngOnInit(): void {
  }

  getTutorWizardStep(step: BecomeATutorStep): TutorVerificationStepDto {
    return this.steps.find(e => e.step === step);
  }

  private navigateToStep(): void {
    let routeName = '';
    switch (this.currentStep.step) {
      case BecomeATutorStep.AboutYou:
        routeName = 'about-you';
        break;
      case BecomeATutorStep.Education:
        routeName = 'education';
        break;
      case BecomeATutorStep.Research:
        routeName = 'research';
        break;
      case BecomeATutorStep.Languages:
        routeName = 'languages';
        break;
      case BecomeATutorStep.ServicesOffered:
        routeName = 'services-offered';
        break;
      case BecomeATutorStep.ProfilePicture:
        routeName = 'profile-picture';
        break;
      case BecomeATutorStep.PhotoId:
        routeName = 'photo-id';
        break;
      case BecomeATutorStep.Address:
        routeName = 'address';
        break;
      case BecomeATutorStep.ContactNumber:
        routeName = 'contact-number';
        break;
      case BecomeATutorStep.References:
        routeName = 'references';
        break;
      case BecomeATutorStep.DbsCheck:
        routeName = 'dbs-check';
        break;
      case BecomeATutorStep.TermsOfUse:
        routeName = 'terms-of-use';
        break;
      case BecomeATutorStep.PrivacyPolicy:
        routeName = 'privacy-policy';
        break;
      case BecomeATutorStep.Declaration:
        routeName = 'declaration';
        break;
      default:
        this._router.navigate(['/app/dashboard']);
        break;
    }
    if (routeName) {
      this._router.navigate([`/app/tutor-wizard/${routeName}`]);
    }
  }

  private getAllSteps(): void {
    this._tutorWizardServiceProxy.getTutorVerification()
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(result => {
        if (result) {
          this.activeStep = result.currentStep;
          this.steps = result.tutorVerificationSteps;
        }
      });
  }
}
