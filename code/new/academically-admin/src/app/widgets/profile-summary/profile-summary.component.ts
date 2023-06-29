import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { BecomeATutorStep, TutorWizardServiceProxy, UserLoginInfoDto } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.less']
})
export class ProfileSummaryComponent extends AppComponentBase implements OnInit {
  user: UserLoginInfoDto;
  userTitle: string;
  canBecomeATutor = false;

  constructor(
    injector: Injector,
    private _router: Router,
    private _tutorWizardServiceProxy: TutorWizardServiceProxy,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
    this.user = this.appSession.user;
    this.userTitle = this.user.roles.filter(e => e.toLowerCase() === 'tutor').length > 0 ? 'Tutor' : 'Student';
  }

  ngOnInit(): void {
    this.getCurrentWizardStep();
  }

  onTutorWizardClick(): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('TutorWizardConfirmationMessage'),
      confirmCb: (): void => {
        this._router.navigate(['/app/tutor-wizard']);
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  private getCurrentWizardStep(): void {
    if (this.permission.isGranted('Pages.TutorWizard')) {
      this._tutorWizardServiceProxy.getCurrentStep()
        .pipe(
          takeUntil(this.destroyed$)
        )
        .subscribe(currentStep => {
          if (currentStep) {
            this.canBecomeATutor = currentStep.step <= BecomeATutorStep.Declaration;
          }
        });
    }
  }
}
