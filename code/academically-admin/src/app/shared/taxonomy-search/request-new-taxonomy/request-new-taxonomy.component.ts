import { Component, Injector, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-request-new-taxonomy',
  templateUrl: './request-new-taxonomy.component.html',
  styleUrls: ['./request-new-taxonomy.component.less']
})
export class RequestNewTaxonomyComponent extends AppComponentBase implements OnInit {
  @Input() parentTaxonomy: GetAllDisciplineTaxonomyDto;
  model: DisciplineTaxonomyRequestDto = new DisciplineTaxonomyRequestDto();
  disciplineTaxonomiesDataSource: Observable<DisciplineTaxonomyDto[]>;
  disciplineTaxonomies: GetAllDisciplineTaxonomyDto[] = [];
  disciplineTaxonomyName = '';
  isLoading = false;
  constructor(injector: Injector, private _disciplineTaxonomiesService: DisciplineTaxonomiesServiceProxy, private _modalRef: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void {
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
  }

  private getDisciplineTaxonomies(): void {
    this._disciplineTaxonomiesService.getAllEditableTaxonomies().subscribe(disciplineTaxonomies => {
      this.disciplineTaxonomies = disciplineTaxonomies;
    });
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
        this.message.success(this.l('NewDisciplineTaxonomyRequestSent'));
        this.close();
      });
  }
}
