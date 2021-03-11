import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UserEducationLevelDto } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CreateEditProfileEducationLevelComponent } from './create-edit-profile-education-level/create-edit-profile-education-level.component';

@Component({
  selector: 'app-profile-education-levels',
  templateUrl: './profile-education-levels.component.html',
  styleUrls: ['./profile-education-levels.component.less']
})
export class ProfileEducationLevelsComponent extends AppComponentBase implements OnInit {
  public userEducationLevels: UserEducationLevelDto[] = [];

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onAddLevelClick(): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-lg';
    const modalRef = this._modalService.show(CreateEditProfileEducationLevelComponent, modalSettings);
    const modal: CreateEditProfileEducationLevelComponent = modalRef.content;
    modal.userEducationLevelSaved.subscribe((userEducationLevel: UserEducationLevelDto) => {
      if (userEducationLevel) {
        this.userEducationLevels.push(userEducationLevel);
      }
    });
  }
}
