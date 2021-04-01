import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DisciplineTaxonomiesServiceProxy, DisciplineTaxonomyDto, UserResearchInterestDto, UserResearchInterestsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Observer } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-research-interest',
  templateUrl: './create-edit-research-interest.component.html',
  styleUrls: ['./create-edit-research-interest.component.less']
})
export class CreateEditResearchInterestComponent extends AppComponentBase implements OnInit {
  @Output() userResearchInterestSaved = new EventEmitter();
  userResearchInterest: UserResearchInterestDto = new UserResearchInterestDto();
  isLoading = false;
  disciplineTaxonomiesTypeaheadSource: Observable<DisciplineTaxonomyDto[]>;
  disciplineTaxonomy: string;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _userResearchInterestsService: UserResearchInterestsServiceProxy,
    private _disciplineTaxonomiesService: DisciplineTaxonomiesServiceProxy
  ) {
    super(injector);
    this.userResearchInterest.disciplineTaxonomies = [];
  }

  ngOnInit(): void {
    this.getDisciplineTaxonomies();
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this._userResearchInterestsService.create(this.userResearchInterest)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(() => {
        this.isLoading = false;
        this.notify.success(this.l('SavedSuccessfully'));
        this.userResearchInterestSaved.emit();
        this._modal.hide();
      })
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onDisciplineTaxonomySelect(disciplineTaxonomy: DisciplineTaxonomyDto): void {
    this.disciplineTaxonomy = '';
    this.userResearchInterest.disciplineTaxonomies.push(disciplineTaxonomy);
  }

  onRemoveDisciplineTaxonomyClick(id: string): void {
    const index = this.userResearchInterest.disciplineTaxonomies.findIndex(e => e.id === id);
    if (index > -1) {
      this.userResearchInterest.disciplineTaxonomies.splice(index, 1);
    }
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
