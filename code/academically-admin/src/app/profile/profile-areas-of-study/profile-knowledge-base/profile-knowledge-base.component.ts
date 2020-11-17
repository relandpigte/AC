import { Component, Injector, Input, OnInit } from '@angular/core';
import { StudyLevelsComponent } from '@app/shared/study-levels/study-levels.component';
import { TaxonomySearchComponent } from '@app/shared/taxonomy-search/taxonomy-search.component';
import { AppComponentBase } from '@shared/app-component-base';
import {
  GetAllDisciplineTaxonomyDto,
  GetUserDisciplineTaxonomyDto,
  UserProfilesServiceProxy,
  DisciplineTaxonomyStudyLevelDto,
  DisciplineTaxonomyStudyLevelsServiceProxy
} from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'profile-knowledge-base',
  templateUrl: './profile-knowledge-base.component.html',
  styleUrls: ['./profile-knowledge-base.component.less']
})
export class ProfileKnowledgeBaseComponent extends AppComponentBase implements OnInit {
  @Input() userId: number;
  @Input() isViewOnly = false;

  disciplineTaxonomyName: string;
  userDisciplineTaxonomies: GetUserDisciplineTaxonomyDto[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private _userProfilesService: UserProfilesServiceProxy,
    private _modalService: BsModalService,
    private _disciplineTaxonomyStudyLevelService: DisciplineTaxonomyStudyLevelsServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getDiscplineTaxonomiesOfUser();
  }

  onRemoveDisciplineTaxonomyClick(userDisciplineTaxonomyId: string) {
    this.removeDisciplineTaxonomyFromUser(userDisciplineTaxonomyId);
  }

  onAddAreaOfStudyClick(): void {
    this.showTaxonomySearchModal();
  }

  onSelectStudyLevels(disciplineTaxonomyId: string): void {
    this.showSelectStudyLevelsModal(disciplineTaxonomyId);
  }

  private getDiscplineTaxonomiesOfUser(): void {
    this.isLoading = true;
    this._userProfilesService.getDisciplineTaxonomies(this.userId).subscribe(discplineTaxonomies => {
      this.userDisciplineTaxonomies = discplineTaxonomies;
      this.isLoading = false;
    });
  }

  private addDisciplineTaxonomiesToUser(disciplineTaxonomyIds: string[]): void {
    this.isLoading = true;
    this._userProfilesService
      .createManyDisciplineTaxonomy(disciplineTaxonomyIds)
      .pipe(
        finalize(() => {
          this.disciplineTaxonomyName = '';
        })
      )
      .subscribe(() => {
        this.notify.success(this.l('TheAreaOfStudyWasAdded'));
        this.getDiscplineTaxonomiesOfUser();
      });
  }

  private removeDisciplineTaxonomyFromUser(userDisciplineTaxonomyId: string): void {
    this.isLoading = true;
    this._userProfilesService
      .deleteDisciplineTaxonomy(userDisciplineTaxonomyId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.message.success(this.l('TheAreasOfStudyWereAdded'));
        this.getDiscplineTaxonomiesOfUser();
      });
  }

  private saveDisciplineTaxonomyStudyLevelsToUser(disciplineTaxonomyId: string, studyLevelIds: number[]): void {
    this.isLoading = true;
    this._userProfilesService
      .createManyDisciplineTaxonomyStudyLevel(disciplineTaxonomyId, studyLevelIds)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.message.success(this.l('AreaOfStudyLevelsWasUpdated'));
        this.getDiscplineTaxonomiesOfUser();
      });
  }

  private showTaxonomySearchModal(): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-xl';
    modalSettings.initialState = {
      userId: this.appSession.userId
    };
    const modalRef = this._modalService.show(TaxonomySearchComponent, modalSettings);
    const modal: TaxonomySearchComponent = modalRef.content;
    modal.modalSave.subscribe((selectedTaxonomies: GetAllDisciplineTaxonomyDto[]) => {
      const taxonomyIds = selectedTaxonomies.map(e => e.id);
      this.addDisciplineTaxonomiesToUser(taxonomyIds);
    });
  }

  private showSelectStudyLevelsModal(disciplineTaxonomyId: string): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-xl';
    modalSettings.initialState = {
      userId: this.appSession.userId,
      taxonomyId: disciplineTaxonomyId
    };
    const modalRef = this._modalService.show(StudyLevelsComponent, modalSettings);
    const modal: TaxonomySearchComponent = modalRef.content;
    modal.modalSave.subscribe((selectedStudyLevels: DisciplineTaxonomyStudyLevelDto[]) => {
      const studyLevelsId = selectedStudyLevels.map(e => e.id);
      this.saveDisciplineTaxonomyStudyLevelsToUser(disciplineTaxonomyId, studyLevelsId);
    });
  }
}
