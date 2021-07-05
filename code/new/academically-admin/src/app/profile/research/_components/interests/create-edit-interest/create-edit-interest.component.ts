import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DisciplineTaxonomiesServiceProxy, DisciplineTaxonomyDto, UserResearchInterestDisciplineTaxonomyDto, UserResearchInterestDto, UserResearchInterestsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable, Observer } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { ResearchFieldsTreeComponent } from '../research-fields-tree/research-fields-tree.component';

@Component({
  selector: 'app-create-edit-interest',
  templateUrl: './create-edit-interest.component.html',
  styleUrls: ['./create-edit-interest.component.less']
})
export class CreateEditInterestComponent extends AppComponentBase implements OnInit {
  @Output() userResearchInterestSaved = new EventEmitter();
  userResearchInterest: UserResearchInterestDto = new UserResearchInterestDto();
  isLoading = false;
  disciplineTaxonomiesTypeaheadSource: Observable<DisciplineTaxonomyDto[]>;
  disciplineTaxonomy: string;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _modalService: BsModalService,
    private _userResearchInterestsService: UserResearchInterestsServiceProxy,
    private _disciplineTaxonomiesService: DisciplineTaxonomiesServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getDisciplineTaxonomies();
    if (!this.userResearchInterest) {
      this.userResearchInterest = new UserResearchInterestDto();
      this.userResearchInterest.userResearchInterestDisciplineTaxonomies = [];
    }
  }

  onFormSubmit(): void {
    this.isLoading = true;
    (this.userResearchInterest.id
      ? this._userResearchInterestsService.edit(this.userResearchInterest)
      : this._userResearchInterestsService.create(this.userResearchInterest))
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(() => {
        this.isLoading = false;
        this.notify.success(this.l('SavedSuccessfully'));
        this.userResearchInterestSaved.emit();
        this._modal.hide();
      });
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onDisciplineTaxonomySelect(disciplineTaxonomy: DisciplineTaxonomyDto): void {
    this.disciplineTaxonomy = '';
    var userResearchInterestDisciplineTaxonomy = new UserResearchInterestDisciplineTaxonomyDto();
    userResearchInterestDisciplineTaxonomy.disciplineTaxonomy = disciplineTaxonomy;
    this.userResearchInterest.userResearchInterestDisciplineTaxonomies.push(userResearchInterestDisciplineTaxonomy);
  }

  onRemoveDisciplineTaxonomyClick(id: string): void {
    const index = this.userResearchInterest.userResearchInterestDisciplineTaxonomies.findIndex(e => e.disciplineTaxonomy.id === id);
    if (index > -1) {
      this.userResearchInterest.userResearchInterestDisciplineTaxonomies.splice(index, 1);
    }
  }

  onAddResearchFieldsClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ResearchFieldsTreeComponent>;
    modalSettings.class = 'modal-lg';
    const modal = this._modalService.show(ResearchFieldsTreeComponent, modalSettings).content;
    modal.modalSave.subscribe((selectedResearchFields: DisciplineTaxonomyDto[]) => {
      selectedResearchFields.forEach(selectedResearchField => {
        const isExisting = this.userResearchInterest.userResearchInterestDisciplineTaxonomies
          .find(e => e.disciplineTaxonomy.id == selectedResearchField.id);
        if (!isExisting) {
          const userResearchInterestDisciplineTaxonomyDto = new UserResearchInterestDisciplineTaxonomyDto();
          userResearchInterestDisciplineTaxonomyDto.disciplineTaxonomy = selectedResearchField;
          this.userResearchInterest.userResearchInterestDisciplineTaxonomies.push(userResearchInterestDisciplineTaxonomyDto);
        }
      });
    });
  }

  private getDisciplineTaxonomies(): void {
    this.disciplineTaxonomiesTypeaheadSource = new Observable((observer: Observer<string>) => {
      observer.next(this.disciplineTaxonomy);
    }).pipe(
      switchMap((query: string) => {
        return this._disciplineTaxonomiesService.search(query);
      })
    );
  }
}
