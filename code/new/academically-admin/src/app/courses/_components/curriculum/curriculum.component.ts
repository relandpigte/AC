import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { LessonWizardComponent } from '../lesson-wizard/lesson-wizard.component';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.less']
})
export class CurriculumComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onAddLessionClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<LessonWizardComponent>;
    this._modalService.show(LessonWizardComponent, modalSettings);
  }
}
