import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CreateEditResearchInterestComponent } from './create-edit-research-interest/create-edit-research-interest.component';

@Component({
  selector: 'app-research-interests',
  templateUrl: './research-interests.component.html',
  styleUrls: ['./research-interests.component.less']
})
export class ResearchInterestsComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onAddClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditResearchInterestComponent>;
    this._modalService.show(CreateEditResearchInterestComponent, modalSettings);
  }
}
