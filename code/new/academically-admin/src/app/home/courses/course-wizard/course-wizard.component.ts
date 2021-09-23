import { Component, OnInit, Injector, } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';

enum CourseWizardState {
  Template,
  Name,
}

@Component({
  selector: 'app-course-wizard',
  templateUrl: './course-wizard.component.html',
  styleUrls: ['./course-wizard.component.less']
})
export class CourseWizardComponent extends AppComponentBase implements OnInit {
  CourseWizardState = CourseWizardState;

  currentWizardState = CourseWizardState.Template;
  isTemplateSelected = false;

  constructor(
    injector: Injector,
    private _modalRef: BsModalRef,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onModalClose(): void {
    this._modalRef.hide();
  }

  onStateChange(wizardState: CourseWizardState): void {
    this.currentWizardState = wizardState;
  }
}
