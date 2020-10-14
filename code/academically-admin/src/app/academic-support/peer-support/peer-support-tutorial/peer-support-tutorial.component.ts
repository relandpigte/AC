import { Component, OnInit, Injector } from '@angular/core';
import { TaxonomySearchComponent } from '@app/shared/taxonomy-search/taxonomy-search.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import {
  DisciplineTaxonomiesServiceProxy,
  DisciplineTaxonomyDto,
  GetAllDisciplineTaxonomyDto
} from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Observable, Observer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'peer-support-tutorial',
  templateUrl: './peer-support-tutorial.component.html',
  styleUrls: ['./peer-support-tutorial.component.less'],
  animations: [appModuleAnimation()]
})
export class PeerSupportTutorialComponent extends AppComponentBase implements OnInit {
  disciplineTaxonomyName = '';
  disciplineTaxonomiesDataSource: Observable<DisciplineTaxonomyDto[]>;
  selectedDisciplineTaxonomies: DisciplineTaxonomyDto[] = [];

  constructor(
    injector: Injector,
    private _disciplineTaxonomiesService: DisciplineTaxonomiesServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getDisciplineTaxonomies();
  }

  onTaxonomySelect(e: TypeaheadMatch): void {
    const disciplineTaxonomy: DisciplineTaxonomyDto = e.item;
    const index = this.selectedDisciplineTaxonomies.findIndex(t => t.id === disciplineTaxonomy.id);
    if (index < 0) {
      this.selectedDisciplineTaxonomies.push(disciplineTaxonomy);
    }
    this.disciplineTaxonomyName = '';
  }

  onRemoveDisciplineTaxonomyClick(id: string): void {
    const index = this.selectedDisciplineTaxonomies.findIndex(e => e.id === id);
    if (index > -1) {
      this.selectedDisciplineTaxonomies.splice(index, 1);
    }
  }

  onBrowseSkillsClick(): void {
    this.showTaxonomySearchModal();
  }

  private getDisciplineTaxonomies(): void {
    this.disciplineTaxonomiesDataSource = new Observable((observer: Observer<string>) => {
      observer.next(this.disciplineTaxonomyName);
    }).pipe(
      switchMap((query: string) => {
        return this._disciplineTaxonomiesService.search(undefined, query);
      })
    );
  }

  private showTaxonomySearchModal(): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-xl';
    const modalRef = this._modalService.show(TaxonomySearchComponent, modalSettings);
    const modal: TaxonomySearchComponent = modalRef.content;
    modal.modalSave.subscribe((selectedTaxonomies: GetAllDisciplineTaxonomyDto[]) => {
      selectedTaxonomies.forEach(e => {
        const index = this.selectedDisciplineTaxonomies.findIndex(t => t.id === e.id);
        if (index < 0) {
          const taxonomy = new DisciplineTaxonomyDto();
          taxonomy.id = e.id;
          taxonomy.name = e.name;
          this.selectedDisciplineTaxonomies.push(taxonomy);
        }
      });
    });
  }
}
