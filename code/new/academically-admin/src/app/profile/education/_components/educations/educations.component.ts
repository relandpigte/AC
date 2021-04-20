import { Component, Injector, OnInit } from '@angular/core';
import { ProfileService } from '@app/profile/_services/profile.service';
import { AppComponentBase } from '@shared/app-component-base';
import { UserEducationDto, UserEducationsServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash-es';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CreateEditEducationComponent } from './create-edit-education/create-edit-education.component';
import { ViewEducationDocumentsComponent } from './view-education-documents/view-education-documents.component';

@Component({
  selector: 'app-educations',
  templateUrl: './educations.component.html',
  styleUrls: ['./educations.component.less']
})
export class EducationsComponent extends AppComponentBase implements OnInit {
  userId: number;
  userEducations: UserEducationDto[] = [];

  constructor(
    injector: Injector,
    private _profileService: ProfileService,
    private _modalService: BsModalService,
    private _userEducationsService: UserEducationsServiceProxy,
  ) {
    super(injector);
    this._profileService.user$.subscribe(user => {
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

  onViewDocumentsClick(userEducation: UserEducationDto): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.initialState = {
      userEducationDocuments: userEducation.userEducationDocuments,
    };
    this._modalService.show(ViewEducationDocumentsComponent, modalSettings);
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
    const modalRef = this._modalService.show(CreateEditEducationComponent, modalSettings);
    const modal: CreateEditEducationComponent = modalRef.content;
    modal.userEducationSaved.subscribe((result: boolean) => {
      if (result) {
        this.getUserEducations();
      }
    });
  }
}
