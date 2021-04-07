import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CreateEditResearchPublicationComponent } from './create-edit-research-publication/create-edit-research-publication.component';

@Component({
  selector: 'app-research-publications',
  templateUrl: './research-publications.component.html',
  styleUrls: ['./research-publications.component.less']
})
export class ResearchPublicationsComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onAddClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditResearchPublicationComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {

    };
    const modal = this._modalService.show(CreateEditResearchPublicationComponent, modalSettings).content;
    // modal.userResearchMethodologySaved.subscribe(() => {
    //   this.pageNumber = 1;
    //   this.refresh();
    // });
  }
}
