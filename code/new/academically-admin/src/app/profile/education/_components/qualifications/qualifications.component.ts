import { Component, Injector, OnInit, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UserQualificationDto, UserQualificationsServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateEditQualificationComponent } from './create-edit-qualification/create-edit-qualification.component';
import { ViewQualificationDocumentsComponent } from './view-qualification-documents/view-qualification-documents.component';
import { ProfileService } from '@app/profile/_services/profile.service';

@Component({
  selector: 'app-qualifications',
  templateUrl: './qualifications.component.html',
  styleUrls: ['./qualifications.component.less']
})
export class QualificationsComponent extends AppComponentBase implements OnInit {
  userId: number;
  userQualifications: UserQualificationDto[] = [];
  deleteLoaders: boolean[] = [];
  isLoading = false;
  isViewOnly = false;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _userQualificationsService: UserQualificationsServiceProxy,
    private _profileService: ProfileService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._profileService.isViewOnly$.subscribe(isViewOnly => {
      this.isViewOnly = isViewOnly;
    });
    this._profileService.user$.subscribe(user => {
      if (user && user.id) {
        this.userId = user.id;
        this.getQualifications();
      }
    });
  }

  onAddClick(): void {
    this.showCreateEditQualificationModal(new UserQualificationDto());
  }

  onEditClick(userQualification: UserQualificationDto): void {
    this.showCreateEditQualificationModal(_.cloneDeep(userQualification));
  }

  onViewDocumentsClick(userQualification: UserQualificationDto): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.initialState = {
      userQualificationDocuments: userQualification.userQualificationDocuments,
    };
    this._modalService.show(ViewQualificationDocumentsComponent, modalSettings);
  }

  onDeleteClick(id: string): void {
    this.message.confirm(
      undefined,
      undefined,
      (result: boolean) => {
        if (result) {
          this.deleteLoaders[id] = true;
          this._userQualificationsService.delete(id)
            .pipe(finalize(() => {
              this.deleteLoaders[id] = true;
            }))
            .subscribe(() => {
              this.getQualifications();
              this.notify.success('SuccessfullyDeleted');
            });
        }
      }
    );
  }

  private showCreateEditQualificationModal(userQualification: UserQualificationDto): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      userQualification: userQualification,
    };
    const modal = this._modalService.show(CreateEditQualificationComponent, modalSettings).content;
    modal.qualificationSaved.subscribe((result: boolean) => {
      if (result) {
        this.getQualifications();
      }
    });
  }

  private getQualifications(): void {
    this.isLoading = true;
    this._userQualificationsService.getAll(this.userId)
      .subscribe(userQualifications => {
        this.userQualifications = userQualifications;
        this.isLoading = false;
      });
  }
}
