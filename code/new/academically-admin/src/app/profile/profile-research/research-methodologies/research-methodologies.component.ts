import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CreateEditResearchMethodologyComponent } from './create-edit-research-methodology/create-edit-research-methodology.component';

@Component({
  selector: 'app-research-methodologies',
  templateUrl: './research-methodologies.component.html',
  styleUrls: ['./research-methodologies.component.less']
})
export class ResearchMethodologiesComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onAddClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditResearchMethodologyComponent>;
    const modal = this._modalService.show(CreateEditResearchMethodologyComponent, modalSettings).content;
  }
}
