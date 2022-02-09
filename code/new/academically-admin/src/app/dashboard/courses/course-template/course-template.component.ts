import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-course-template',
  templateUrl: './course-template.component.html',
  styleUrls: ['./course-template.component.less']
})
export class CourseTemplateComponent extends AppComponentBase implements OnInit {
  @Output() modalClose = new EventEmitter();
  @Output() selectTemplate = new EventEmitter();

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onTemplateSelected(): void {
    this.selectTemplate.emit();
  }

  onCancelClick(): void {
    this.modalClose.emit();
  }
}
