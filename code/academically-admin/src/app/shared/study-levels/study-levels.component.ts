import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DisciplineTaxonomyStudyLevelDto, DisciplineTaxonomyStudyLevelsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

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

  constructor(
    injector: Injector,
    private _disciplineTaxonomiesStudyLevelsService: DisciplineTaxonomyStudyLevelsServiceProxy,
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

  onStudyLevelSelect(studyLevel: DisciplineTaxonomyStudyLevelDto): void {
    const index = this.selectedStudyLevels.findIndex(e => e.id === studyLevel.id);
    if (index < 0) {
      this.selectedStudyLevels.push(studyLevel);
    }
  }

  private getUserTaxonomiesStudyLevels(): void {
    this._disciplineTaxonomiesStudyLevelsService
      .getUserDisciplineTaxonomyStudyLevels(this.userId, this.taxonomyId)
      .subscribe(userTaxonomyStudyLevels => {
        this.selectedStudyLevels = userTaxonomyStudyLevels;
      });
  }

  private getTaxonomiesStudyLevels(): void {
    this.isLoading = true;
    this._disciplineTaxonomiesStudyLevelsService.getAll(this.userId, this.taxonomyId).subscribe(studyLevels => {
      this.studyLevels = this.studyLevels;
      this.isLoading = false;
    });
  }
}
