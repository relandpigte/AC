import { Component, Injector, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ProfilesServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { ProfileService } from '@shared/services/profile.service';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-profile-introduction-about',
  templateUrl: './profile-introduction-about.component.html',
  styleUrls: ['./profile-introduction-about.component.less']
})
export class ProfileIntroductionAboutComponent extends AppComponentBase implements OnDestroy {
  user: UserDto;
  isViewOnly = true;
  isEditingAbout = false;
  isSavingAbout = false;
  editor: Editor;

  constructor(
    injector: Injector,
    profileService: ProfileService,
    private _profilesService: ProfilesServiceProxy,
  ) {
    super(injector);
    profileService.$user.subscribe(user => {
      this.user = user;
    });
    profileService.$isViewOnly.subscribe(isViewOnly => {
      this.isViewOnly = isViewOnly;
    });
  }

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
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
