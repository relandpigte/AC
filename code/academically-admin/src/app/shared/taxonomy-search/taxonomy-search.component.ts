import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DisciplineTaxonomiesServiceProxy, GetAllDisciplineTaxonomyDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RequestNewTaxonomyComponent } from './request-new-taxonomy/request-new-taxonomy.component';

@Component({
  selector: 'app-taxonomy-search',
  templateUrl: './taxonomy-search.component.html',
  styleUrls: ['./taxonomy-search.component.less']
})
export class TaxonomySearchComponent extends AppComponentBase implements OnInit {
  @Input() userId: number;
  @Output() modalSave = new EventEmitter<GetAllDisciplineTaxonomyDto[]>();
  taxonomies: GetAllDisciplineTaxonomyDto[] = [];
  selectedTaxonomies: GetAllDisciplineTaxonomyDto[] = [];
  selectedParentTaxonomy: GetAllDisciplineTaxonomyDto = new GetAllDisciplineTaxonomyDto();
  searchKeyword = '';
  isLoading = false;

  constructor(
    injector: Injector,
    private _disciplineTaxonomiesService: DisciplineTaxonomiesServiceProxy,
    private _modalRef: BsModalRef,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getTaxonomies();
  }

  onCloseClick(): void {
    this.close();
  }

  onTaxonomySelectParent(taxonomy: GetAllDisciplineTaxonomyDto): void {
    this.selectedParentTaxonomy = taxonomy;
  }

  onAddClick(): void {
    this.showSuggestNewTaxonomyModal();
  }

  onTaxonomySelect(taxonomy: GetAllDisciplineTaxonomyDto): void {
    const index = this.selectedTaxonomies.findIndex(e => e.id === taxonomy.id);
    if (index < 0) {
      this.selectedTaxonomies.push(taxonomy);
    }
  }

  onRemoveTaxonomyClick(id: string): void {
    const index = this.selectedTaxonomies.findIndex(e => e.id === id);
    if (index > -1) {
      this.selectedTaxonomies.splice(index, 1);
    }
  }

  onFormSubmit(): void {
    this._modalRef.hide();
    setTimeout(() => {
      this.modalSave.emit(this.selectedTaxonomies);
    }, 300);
  }

  private close(): void {
    if (this.selectedTaxonomies.length > 0) {
      this.message.confirm(this.l('AreasOfStudyNotSavedWarning'), undefined, (result: boolean) => {
        if (result) {
          this._modalRef.hide();
        }
      });
    } else {
      this._modalRef.hide();
    }
  }

  private getTaxonomies(): void {
    this.isLoading = true;
    this._disciplineTaxonomiesService.getAll(this.userId).subscribe(taxonomies => {
      this.taxonomies = taxonomies;
      this.isLoading = false;
    });
  }

  private showSuggestNewTaxonomyModal(): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.initialState = {
      parentTaxonomy: this.selectedParentTaxonomy
    };
    const _modalRef = this._modalService.show(RequestNewTaxonomyComponent, modalSettings);
    const modal: RequestNewTaxonomyComponent = _modalRef.content;
    modal.isSuccess.subscribe((status: boolean) => {
      debugger;
      if (status) {
        this.selectedParentTaxonomy = new GetAllDisciplineTaxonomyDto();
      }
    });
  }
}
