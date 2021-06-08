import { ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { ProfileService } from '@app/profile/_services/profile.service';
import { AppComponentBase } from '@shared/app-component-base';
import { ProfilesServiceProxy, UniversityDto, UserEducationDto, UserEducationsServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash-es';
import { BsModalService } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { CreateEditEducationComponent } from './create-edit-education/create-edit-education.component';
import { ViewEducationDocumentsComponent } from './view-education-documents/view-education-documents.component';

class UserEducation {
  educations: UserEducationDto[] = [];
  universityName: string | undefined;
  universityCountryCode: string | undefined;
  city: string | undefined;
  isRendered: boolean;
  id: string | undefined;
}

@Component({
  selector: 'app-educations',
  templateUrl: './educations.component.html',
  styleUrls: ['./educations.component.less']
})
export class EducationsComponent extends AppComponentBase implements OnInit {
  @Input() userId: number;
  public universities: UniversityDto[] = [];
  isLoading = false;

  userEducationGroup: UserEducation[] = [];

  constructor(
    injector: Injector,
    private _changeDetector: ChangeDetectorRef,
    private _profileService: ProfileService,
    private _modalService: BsModalService,
    private _profilesService: ProfilesServiceProxy,
    private _userEducationsService: UserEducationsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._profileService.user$.subscribe(user => {
      if (user && user.id) {
        this.userId = user.id;
      }
      this.getUserEducations();
    });
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
              this.refreshUser();
            });
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

  isFirstItemInEducations(id: string): boolean {
    const university = this.userEducationGroup.find(u => u.id === id);
    console.log(university);
    return university !== undefined;
  }

  countUserEducation(name: string): number {
    const university = this.getUserEducationFromGroup(name);
    return university.educations.length;
  }

  private getUserEducationFromGroup(name: string): UserEducation {
    const university = this.userEducationGroup.find(u => u.universityName === name);
    return university;
  }

  private getUserEducations(): void {
    this.isLoading = true;
    this._userEducationsService.getAll(this.userId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(universities => {
        this.universities = universities;
      });
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
        this.refreshUser();
      }
    });
  }

  private refreshUser(): void {
    this._profilesService.get(this.userId)
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(user => {
        this._profileService.user = user;
      });
  }
}
