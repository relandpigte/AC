import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { BecomeATutorStep } from '@shared/service-proxies/service-proxies';
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
  currentStep: BecomeATutorStep;
  isComingSoon = false;

  constructor(
    injector: Injector,
    private _becomeATutorService: BecomeATutorService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) {
    super(injector);
    this._route.data
      .pipe(
        takeUntil(this.destroyed$),
      ).subscribe(data => {
        this.currentStep = data.currentStep as BecomeATutorStep;
        this.navigateToStep();
      });
    this._becomeATutorService.currentStep$
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(currentStep => {
        if (currentStep !== null && currentStep !== undefined) {
          this.currentStep = currentStep;
          this.navigateToStep();
        }
      });
  }

  ngOnInit(): void {
  }

  private navigateToStep(): void {
    switch (this.currentStep) {
      case BecomeATutorStep.AboutYou:
        this._router.navigate(['/app/tutor-wizard/about-you']);
        break;
      case BecomeATutorStep.Education:
        this._router.navigate(['/app/tutor-wizard/education']);
        break;
        case BecomeATutorStep.Research:
          this._router.navigate(['/app/tutor-wizard/research']);
          break;
      default:
        this.isComingSoon = true;
        break;
    }
  }
}
