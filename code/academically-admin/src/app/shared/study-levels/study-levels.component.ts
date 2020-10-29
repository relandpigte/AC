import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  DisciplineTaxonomyStudyLevelDto,
  DisciplineTaxonomyStudyLevelsServiceProxy,
  UserProfilesServiceProxy
} from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as _ from 'lodash';

@Component({
  selector: 'app-study-levels',
  templateUrl: './study-levels.component.html',
  styleUrls: ['./study-levels.component.less']
})
export class StudyLevelsComponent extends AppComponentBase implements OnInit {
  @Input() userId: number;
  @Input() taxonomyId: string;
  @Output() modalSave = new EventEmitter<DisciplineTaxonomyStudyLevelDto[]>();
  studyLevels: DisciplineTaxonomyStudyLevelDto[] = [];
  selectedStudyLevels: DisciplineTaxonomyStudyLevelDto[] = [];
  isLoading = false;
  studyLevelName: string;

  constructor(
    injector: Injector,
    private _disciplineTaxonomiesStudyLevelsService: DisciplineTaxonomyStudyLevelsServiceProxy,
    private _userProfileService: UserProfilesServiceProxy,
    private _modalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getTaxonomiesStudyLevels();
    this.getUserTaxonomiesStudyLevels();
  }

  onFormSubmit(): void {
    this._modalRef.hide();
    this.modalSave.emit(this.selectedStudyLevels);
  }
  onCloseClick(): void {
    this._modalRef.hide();
  }

  onStudyLevelSelect(studyLevel: DisciplineTaxonomyStudyLevelDto): void {
    const index = this.selectedStudyLevels.findIndex(e => e.id === studyLevel.id);
    const studyLevelIndex = this.studyLevels.findIndex(e => e.id === studyLevel.id);
    if (index < 0) {
      this.selectedStudyLevels.push(studyLevel);
      this.studyLevelName = '';
    }
    if (studyLevelIndex > -1) {
      this.studyLevels.splice(studyLevelIndex, 1);
    }
  }

  onRemoveStudyLevelClick(selectedStudyLevel: DisciplineTaxonomyStudyLevelDto): void {
    const index = this.selectedStudyLevels.findIndex(e => e.id === selectedStudyLevel.id);
    const studyLevelIndex = this.studyLevels.findIndex(e => e.id === selectedStudyLevel.id);
    if (index > -1) {
      this.selectedStudyLevels.splice(index, 1);
    }
    if (studyLevelIndex < 0) {
      this.getTaxonomiesStudyLevels(selectedStudyLevel.id);
    }
  }

  private getUserTaxonomiesStudyLevels(): void {
    this._userProfileService.getUserDisciplineTaxonomyStudyLevels(this.userId, this.taxonomyId).subscribe(userTaxonomyStudyLevels => {
      this.selectedStudyLevels = userTaxonomyStudyLevels;
    });
  }

  private getTaxonomiesStudyLevels(id?: number): void {
    this.isLoading = true;
    this._disciplineTaxonomiesStudyLevelsService.getAll(this.userId, this.taxonomyId).subscribe(studyLevels => {
      if (id && this.studyLevels.length !== studyLevels.length) {
        _.forEach(this.selectedStudyLevels, studyLevel => {
          studyLevels = studyLevels.filter(e => e.id !== studyLevel.id);
          this.studyLevels = studyLevels;
        });
      } else {
        this.studyLevels = studyLevels;
      }
      this.isLoading = false;
    });
  }
}
