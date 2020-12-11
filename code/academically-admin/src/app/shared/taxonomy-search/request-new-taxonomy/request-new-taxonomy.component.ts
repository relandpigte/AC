import { Component, Injector, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  DisciplineTaxonomiesServiceProxy,
  DisciplineTaxonomyDto,
  DisciplineTaxonomyRequestDto,
  GetAllDisciplineTaxonomyDto
} from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { Observable, Observer } from 'rxjs';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-request-new-taxonomy',
  templateUrl: './request-new-taxonomy.component.html',
  styleUrls: ['./request-new-taxonomy.component.less']
})
export class RequestNewTaxonomyComponent extends AppComponentBase implements OnInit {
  @Input() parentTaxonomy: GetAllDisciplineTaxonomyDto;
  @Output() isSuccess = new EventEmitter<boolean>();
  model: DisciplineTaxonomyRequestDto = new DisciplineTaxonomyRequestDto();
  disciplineTaxonomiesDataSource: Observable<DisciplineTaxonomyDto[]>;
  disciplineTaxonomies: GetAllDisciplineTaxonomyDto[] = [];
  disciplineTaxonomyName = '';
  isLoading = false;
  constructor(injector: Injector, private _disciplineTaxonomiesService: DisciplineTaxonomiesServiceProxy, private _modalRef: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void {
    debugger;
    if (!_.isEmpty(this.parentTaxonomy) && !this.parentTaxonomy.isEditable) {
      this.notify.info(this.l('UnableToSuggestAreaOfStudy'));
      this.parentTaxonomy = new GetAllDisciplineTaxonomyDto();
    }
    this.model.parentId = this.parentTaxonomy.id;
    this.disciplineTaxonomyName = this.parentTaxonomy.name;
    this.getDisciplineTaxonomies();
  }

  onCloseClick(): void {
    this.close();
  }

  onFormSubmit(): void {
    this.saveDisciplineTaxonomyRequest();
  }

  onTaxonomySelect(e: TypeaheadMatch): void {
    const disciplineTaxonomy: DisciplineTaxonomyDto = e.item;
    this.model.parentId = disciplineTaxonomy.id;
    this.disciplineTaxonomyName = disciplineTaxonomy.name;
  }

  private close(): void {
    this._modalRef.hide();
    this.isSuccess.emit(true);
  }

  private getDisciplineTaxonomies(): void {
    this.disciplineTaxonomiesDataSource = new Observable((observer: Observer<string>) => {
      observer.next(this.disciplineTaxonomyName);
    }).pipe(
      switchMap((query: string) => {
        return this._disciplineTaxonomiesService.searchAllEditable(undefined, query);
      })
    );
  }

  private saveDisciplineTaxonomyRequest(): void {
    this.isLoading = true;
    this._disciplineTaxonomiesService
      .requestDisciplineTaxonomy(this.model)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.isSuccess.emit(true);
        this.disciplineTaxonomyName = '';
        this.parentTaxonomy = new GetAllDisciplineTaxonomyDto();
        this.model = new DisciplineTaxonomyRequestDto();
        this.message.success(this.l('NewDisciplineTaxonomyRequestSent'));
        this.close();
      });
  }
}
