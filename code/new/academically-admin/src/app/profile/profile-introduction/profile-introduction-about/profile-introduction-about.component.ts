import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ProfilesServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { ProfileService } from '@shared/services/profile.service';

@Component({
  selector: 'app-profile-introduction-about',
  templateUrl: './profile-introduction-about.component.html',
  styleUrls: ['./profile-introduction-about.component.less']
})
export class ProfileIntroductionAboutComponent extends AppComponentBase {
  user: UserDto;
  isViewOnly = true;
  isEditingAbout = false;
  isSavingAbout = false;
  aboutCollapseLimit = 400;
  aboutLength: number;
  isAboutExpanded = false;

  constructor(
    injector: Injector,
    profileService: ProfileService,
    private _profilesService: ProfilesServiceProxy,
  ) {
    super(injector);
    this.aboutLength = this.aboutCollapseLimit;
    profileService.$user.subscribe(user => {
      this.user = user;
    });
    profileService.$isViewOnly.subscribe(isViewOnly => {
      this.isViewOnly = isViewOnly;
    });
  }

  ngOnInit(): void {
  }

  onEditAboutClick(): void {
    this.isEditingAbout = true;
  }

  onSaveAboutClick(): void {
    this.isSavingAbout = true;
    this._profilesService.updateAbout(this.user.about ?? undefined)
      .subscribe(() => {
        this.isEditingAbout = false;
        this.isSavingAbout = false;
        if (this.isAboutExpanded) {
          this.aboutLength = this.user.about.length;
        }
      });
  }

  onReadMoreAboutClick(isAboutExpanded: boolean): void {
    this.isAboutExpanded = isAboutExpanded;
    this.aboutLength = this.isAboutExpanded ? this.user.about.length : this.aboutCollapseLimit;
  }
}
