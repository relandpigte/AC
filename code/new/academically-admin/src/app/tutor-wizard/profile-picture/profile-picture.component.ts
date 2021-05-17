import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { uiEvents } from '@shared/constants/ui-events.constant';
import { BecomeATutorStep, ProfilesServiceProxy, TutorWizardServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { BecomeATutorService } from '../_services/become-a-tutor.service';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.less']
})
export class ProfilePictureComponent extends AppComponentBase implements OnInit {
  user: UserDto = new UserDto();
  isLoading = false;

  constructor(
    injector: Injector,
    private _profilesService: ProfilesServiceProxy,
    private _tutorWizardService: TutorWizardServiceProxy,
    private _becomeATutorService: BecomeATutorService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this._profilesService.get(this.appSession.userId)
      .subscribe(user => {
        this.user = user;
      });
  }

  onProfilePictureUpdated(profilePictureUrl: string): void {
    this.user.profilePictureUrl = profilePictureUrl;
    abp.event.trigger(uiEvents.profileDetailsUpdated, profilePictureUrl);
  }

  onNextClick(): void {
    this.isLoading = true;
    const nextStep = BecomeATutorStep.PhotoId;
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
