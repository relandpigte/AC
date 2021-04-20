import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ResearchMethodDto, UserResearchMethodologiesServiceProxy, UserResearchMethodologyDto, UserResearchMethodologyResearchMethodDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ResearchMethodTreeComponent } from '../research-method-tree/research-method-tree.component';

@Component({
  selector: 'app-create-edit-methodology',
  templateUrl: './create-edit-methodology.component.html',
  styleUrls: ['./create-edit-methodology.component.less']
})
export class CreateEditMethodologyComponent extends AppComponentBase implements OnInit {
  @Input() userResearchMethodology: UserResearchMethodologyDto;
  @Output() userResearchMethodologySaved = new EventEmitter();
  researchMethodsTypeaheadSource: Observable<ResearchMethodDto[]>;
  researchMethod = '';
  isLoading = false;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _modalService: BsModalService,
    private _userResearchMethodsService: UserResearchMethodologiesServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    if (!this.userResearchMethodology) {
      this.userResearchMethodology = new UserResearchMethodologyDto();
      this.userResearchMethodology.title = 'Quantitative';
      this.userResearchMethodology.userResearchMethodologyResearchMethods = [];
    }
  }

  onFormSubmit(): void {
    this.isLoading = true;
    (this.userResearchMethodology.id
      ? this._userResearchMethodsService.edit(this.userResearchMethodology)
      : this._userResearchMethodsService.create(this.userResearchMethodology))
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(() => {
        this.isLoading = false;
        this.notify.success(this.l('SavedSuccessfully'));
        this.userResearchMethodologySaved.emit();
        this._modal.hide();
      });
  }

  onRemoveResearchMethodClick(id: string): void {
    const index = this.userResearchMethodology.userResearchMethodologyResearchMethods.findIndex(e => e.researchMethod.id === id);
    if (index > -1) {
      this.userResearchMethodology.userResearchMethodologyResearchMethods.splice(index, 1);
    }
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onAddResearchMethodsClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ResearchMethodTreeComponent>;
    modalSettings.class = 'modal-lg';
    const modal = this._modalService.show(ResearchMethodTreeComponent, modalSettings).content;
    modal.modalSave.subscribe((selectedMethods: ResearchMethodDto[]) => {
      selectedMethods.forEach(selectedMethod => {
        var userResearchMethodologyResearchMethod = new UserResearchMethodologyResearchMethodDto();
        userResearchMethodologyResearchMethod.researchMethod = selectedMethod;
        this.userResearchMethodology.userResearchMethodologyResearchMethods.push(userResearchMethodologyResearchMethod);
      })
    });
  }
}
