import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { LessonWizardComponent } from './_components/lesson-wizard/lesson-wizard.component';

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
    const modal = this._modalService.show(LessonWizardComponent, modalSettings).content;
  }
}
