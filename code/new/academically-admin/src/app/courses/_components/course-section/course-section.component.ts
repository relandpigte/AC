import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseSectionDto, CourseSectionStatus, CourseSectionType } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-course-section',
  templateUrl: './course-section.component.html',
  styleUrls: ['./course-section.component.less']
})
export class CourseSectionComponent extends AppComponentBase implements OnInit {

  courseSectionType = CourseSectionType;
  @Input() courseSection: CourseSectionDto = new CourseSectionDto();
  @Output() duplicate = new EventEmitter();
  @Output() editSection = new EventEmitter();
  @Output() addSection = new EventEmitter();
  @Output() deleteSection = new EventEmitter();
  CourseSectionStatus = CourseSectionStatus;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    console.log(this.courseSection);
  }

  onDuplicateClick(courseSection) {
    this.duplicate.emit(courseSection);
  }

  onAddEditCourseSectionClick(courseSection) {
    this.editSection.emit(courseSection);
  }

  onDeleteClick(id) {
    this.deleteSection.emit(id);
  }

  onAddCourseSectionClick(courseSectionUnit) {
    this.addSection.emit(courseSectionUnit);
  }

}
