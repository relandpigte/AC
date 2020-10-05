import { Component, OnInit, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { DisciplineTaxonomiesServiceProxy, DisciplineTaxonomyDto } from '@shared/service-proxies/service-proxies';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Observable, Observer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.less'],
  animations: [appModuleAnimation()],
})
export class TutorialComponent extends AppComponentBase implements OnInit {
  disciplineTaxonomyName = '';
  disciplineTaxonomiesDataSource: Observable<DisciplineTaxonomyDto[]>;
  selectedDisciplineTaxonomies: DisciplineTaxonomyDto[] = [];

  constructor(injector: Injector, private _disciplineTaxonomiesService: DisciplineTaxonomiesServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.getDisciplineTaxonomies();
  }

  onTaxonomySelect(e: TypeaheadMatch): void {
    const disciplineTaxonomy: DisciplineTaxonomyDto = e.item;
    this.selectedDisciplineTaxonomies.push(disciplineTaxonomy);
    this.disciplineTaxonomyName = '';
  }

  onRemoveDisciplineTaxonomyClick(id: string): void {
    const index = this.selectedDisciplineTaxonomies.findIndex((e) => e.id === id);
    if (index > -1) {
      this.selectedDisciplineTaxonomies.splice(index, 1);
    }
  }

  private getDisciplineTaxonomies(): void {
    this.disciplineTaxonomiesDataSource = new Observable((observer: Observer<string>) => {
      observer.next(this.disciplineTaxonomyName);
    }).pipe(
      switchMap((query: string) => {
        return this._disciplineTaxonomiesService.search(query);
      })
    );
  }
}
