import { Component, Injector, Input, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { InterestsComponent } from './_components/interests/interests.component';
import { MethodologiesComponent } from './_components/methodologies/methodologies.component';
import { PublicationsComponent } from './_components/publications/publications.component';
import { ProfileService } from '../_services/profile.service';

@Component({
  selector: 'app-profile-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.less']
})
export class ResearchComponent extends AppComponentBase {
  @ViewChild('interests') interests: InterestsComponent;
  @ViewChild('methodologies') methodologies: MethodologiesComponent;
  @ViewChild('publications') publications: PublicationsComponent;
  @Input() userId: number;
  isViewOnly = false;

  constructor(
    injector: Injector,
    profileService: ProfileService,
  ) {
    super(injector);
    profileService.user$.subscribe(user => {
      if (user && user.id) {
        this.userId = user.id;
      }
    });
    profileService.isViewOnly$.subscribe(isViewOnly => {
      this.isViewOnly = isViewOnly;
    });
  }
}
