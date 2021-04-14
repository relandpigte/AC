import { Component, Injector, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ProfileService } from '@shared/services/profile.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-profile-introduction',
  templateUrl: './profile-introduction.component.html',
  styleUrls: ['./profile-introduction.component.less']
})
export class ProfileIntroductionComponent extends AppComponentBase implements OnDestroy {
  isTutor: boolean = false;
  profileSubscription: Subscription;

  constructor(
    injector: Injector,
    profileService: ProfileService,
  ) {
    super(injector);
    this.profileSubscription = profileService.$user
      .subscribe(user => {
        this.isTutor = user.roleNames.findIndex(e => e.toLowerCase() === 'tutor') >= 0;
      });
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }
}
