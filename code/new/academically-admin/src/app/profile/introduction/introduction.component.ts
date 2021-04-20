import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProfileService } from '../_services/profile.service';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.less']
})
export class IntroductionComponent extends AppComponentBase {
  isTutor: boolean = false;
  profileSubscription: Subscription;

  constructor(
    injector: Injector,
    profileService: ProfileService,
  ) {
    super(injector);
    this.profileSubscription = profileService.user$
      .pipe((takeUntil(this.destroyed$)))
      .subscribe(user => {
        this.isTutor = user.roleNames.findIndex(e => e.toLowerCase() === 'tutor') >= 0;
      });
  }
}
