import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UserEducationDto, UserEducationsServiceProxy } from '@shared/service-proxies/service-proxies';
import { ProfileService } from '@shared/services/profile.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CreateEditProfileEducationComponent } from './create-edit-profile-education/create-edit-profile-education.component';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-profile-education',
  templateUrl: './profile-education.component.html',
  styleUrls: ['./profile-education.component.less']
})
export class ProfileEducationComponent extends AppComponentBase implements OnInit {
  userId: number;
  userEducations: UserEducationDto[] = [];

  constructor(
    injector: Injector,
    profileService: ProfileService,
    private _modalService: BsModalService,
    private _userEducationsService: UserEducationsServiceProxy,
  ) {
    super(injector);
    profileService.$user.subscribe(user => {
      this.userId = user.id;
      this.getUserEducations();
    });
  }

  ngOnInit(): void {
  }

  onAddClick(): void {
    this.showCreateEditUserEducationModal();
  }

  onEditClick(userEducation: UserEducationDto): void {
    this.showCreateEditUserEducationModal(_.cloneDeep(userEducation));
  }

  onDeleteClick(userEducation: UserEducationDto): void {
    this.message.confirm(
      undefined,
      undefined,
      (result: boolean) => {
        if (result) {
          this._userEducationsService.delete(userEducation.id)
            .subscribe(() => {
              this.notify.success('SuccessfullyDeleted');
              this.getUserEducations();
            })
        }
      }
    );
  }

  private getUserEducations(): void {
    this._userEducationsService.getAll(this.userId)
      .subscribe(userEducations => {
        this.userEducations = userEducations;
      })
  }

  private showCreateEditUserEducationModal(userEducation?: UserEducationDto) {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      model: userEducation,
    };
    const modalRef = this._modalService.show(CreateEditProfileEducationComponent, modalSettings);
    const modal: CreateEditProfileEducationComponent = modalRef.content;
    modal.userEducationSaved.subscribe((result: boolean) => {
      if (result) {
        this.getUserEducations();
      }
    });
  }
}
