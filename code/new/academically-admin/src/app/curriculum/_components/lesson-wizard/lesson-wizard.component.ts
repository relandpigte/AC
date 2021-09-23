import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-lesson-wizard',
  templateUrl: './lesson-wizard.component.html',
  styleUrls: ['./lesson-wizard.component.less']
})
export class LessonWizardComponent extends AppComponentBase implements OnInit {
  isTemplateSelected = false;

  constructor(
    injector: Injector,
    private _modal: BsModalService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onTemplateSelected(): void {
    this.isTemplateSelected = !this.isTemplateSelected;
  }

  onFormSubmit(): void {

  }
}
