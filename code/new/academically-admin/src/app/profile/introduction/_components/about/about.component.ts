import { Component, Injector } from '@angular/core';
import { ProfileService } from '@app/profile/_services/profile.service';
import { AppComponentBase } from '@shared/app-component-base';
import { ProfilesServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.less']
})
export class AboutComponent extends AppComponentBase {
  user: UserDto;
  isViewOnly = true;
  isEditingAbout = false;
  isSavingAbout = false;

  constructor(
    injector: Injector,
    profileService: ProfileService,
    private _profilesService: ProfilesServiceProxy,
  ) {
    super(injector);
    profileService.user$.subscribe(user => {
      this.user = user;
    });
    profileService.isViewOnly$.subscribe(isViewOnly => {
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
      });
  }
}
