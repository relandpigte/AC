import { Component, OnInit, Injector, EventEmitter, Output, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';

enum LessonWizardState {
  Template,
  Name,
}

@Component({
  selector: 'app-lesson-wizard',
  templateUrl: './lesson-wizard.component.html',
  styleUrls: ['./lesson-wizard.component.less']
})
export class LessonWizardComponent extends AppComponentBase implements OnInit {
  @Input() courseId: string;
  @Output() courseSaved = new EventEmitter();
  LessonWizardState = LessonWizardState;

  currentWizardState = LessonWizardState.Template;
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

  onStateChange(wizardState: LessonWizardState): void {
    this.currentWizardState = wizardState;
  }

  onCourseSaved(): void {
    this.courseSaved.emit();
  }
}
