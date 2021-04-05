import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ResearchMethodTreeComponent } from '@app/shared/components/research-method-tree/research-method-tree.component';
import { AppComponentBase } from '@shared/app-component-base';
import { ResearchMethodDto, UserResearchMethodologiesServiceProxy, UserResearchMethodologyDto, UserResearchMethodologyResearchMethodDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-research-methodology',
  templateUrl: './create-edit-research-methodology.component.html',
  styleUrls: ['./create-edit-research-methodology.component.less']
})
export class CreateEditResearchMethodologyComponent extends AppComponentBase implements OnInit {
  @Output() userResearchMethodologySaved = new EventEmitter();
  userResearchMethodology: UserResearchMethodologyDto;
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
    this._userResearchMethodsService.create(this.userResearchMethodology)
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

  onCloseClick(): void {
    this._modal.hide();
  }

  onAddResearchMethodsClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ResearchMethodTreeComponent>;
    modalSettings.class = 'modal-lg';
    const modal = this._modalService.show(ResearchMethodTreeComponent, modalSettings).content;
    modal.modalSave.subscribe((selectedMethods: ResearchMethodDto[]) => {
      console.log(selectedMethods);
      selectedMethods.forEach(selectedMethod => {
        var userResearchMethodologyResearchMethod = new UserResearchMethodologyResearchMethodDto();
        userResearchMethodologyResearchMethod.researchMethod = selectedMethod;
        this.userResearchMethodology.userResearchMethodologyResearchMethods.push(userResearchMethodologyResearchMethod);
      })
    });
  }
}
