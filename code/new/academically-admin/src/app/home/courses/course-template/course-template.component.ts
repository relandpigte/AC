import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-course-template',
  templateUrl: './course-template.component.html',
  styleUrls: ['./course-template.component.less']
})
export class CourseTemplateComponent implements OnInit {
  @Output() courseTemplateChanged: EventEmitter<number> = new EventEmitter();
  constructor(
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit(): void {
  }

  onCreateClick(templateId: number) {
    this.courseTemplateChanged.emit(templateId);
  }
}
