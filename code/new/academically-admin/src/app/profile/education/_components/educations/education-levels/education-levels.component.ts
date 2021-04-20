import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UserEducationLevelDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash-es';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CreateEditEducationLevelComponent } from './create-edit-education-level/create-edit-education-level.component';

@Component({
  selector: 'app-education-levels',
  templateUrl: './education-levels.component.html',
  styleUrls: ['./education-levels.component.less']
})
export class EducationLevelsComponent extends AppComponentBase implements OnInit {
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
    this.showCreateEditUserEducationLevelModal();
  }

  onEditLevelClick(userEducationLevel: UserEducationLevelDto): void {
    this.showCreateEditUserEducationLevelModal(_.cloneDeep(userEducationLevel));
  }

  onRemoveLevelClick(userEducationLevel: UserEducationLevelDto): void {
    this.message.confirm(
      undefined,
      undefined,
      (result: boolean) => {
        if (result) {
          const index = this.userEducationLevels.findIndex(e => e.id === userEducationLevel.id);
          if (index >= 0) {
            this.userEducationLevels.splice(index, 1);
          }
        }
      }
    );
  }

  private showCreateEditUserEducationLevelModal(userEducationLevel?: UserEducationLevelDto) {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      model: userEducationLevel,
    };
    const modalRef = this._modalService.show(CreateEditEducationLevelComponent, modalSettings);
    const modal: CreateEditEducationLevelComponent = modalRef.content;
    modal.userEducationLevelSaved.subscribe((userEducationLevel: UserEducationLevelDto) => {
      if (userEducationLevel) {
        if (!userEducationLevel.id) {
          this.userEducationLevels.push(userEducationLevel);
        } else {
          var index = this.userEducationLevels.findIndex(e => e.id === userEducationLevel.id);
          if (index >= 0) {
            this.userEducationLevels[index] = userEducationLevel;
          }
        }
      }
    });
  }
}
