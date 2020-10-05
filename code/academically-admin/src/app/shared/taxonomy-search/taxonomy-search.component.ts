import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DisciplineTaxonomiesServiceProxy, GetAllDisciplineTaxonomyDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-taxonomy-search',
  templateUrl: './taxonomy-search.component.html',
  styleUrls: ['./taxonomy-search.component.less'],
})
export class TaxonomySearchComponent extends AppComponentBase implements OnInit {
  @Input() userId: number;
  @Output() modalSave = new EventEmitter<GetAllDisciplineTaxonomyDto[]>();
  taxonomies: GetAllDisciplineTaxonomyDto[] = [];
  selectedTaxonomies: GetAllDisciplineTaxonomyDto[] = [];
  searchKeyword = '';
  isLoading = false;

  constructor(injector: Injector, private _disciplineTaxonomiesService: DisciplineTaxonomiesServiceProxy, private _modalRef: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void {
    this.getTaxonomies();
  }

  onCloseClick(): void {
    this.close();
  }

  onTaxonomySelect(taxonomy: GetAllDisciplineTaxonomyDto): void {
    const index = this.selectedTaxonomies.findIndex((e) => e.id === taxonomy.id);
    if (index < 0) {
      this.selectedTaxonomies.push(taxonomy);
    }
  }

  onRemoveTaxonomyClick(id: string): void {
    const index = this.selectedTaxonomies.findIndex((e) => e.id === id);
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
    this._disciplineTaxonomiesService.getAll(this.userId).subscribe((taxonomies) => {
      this.taxonomies = taxonomies;
      this.isLoading = false;
    });
  }
}
