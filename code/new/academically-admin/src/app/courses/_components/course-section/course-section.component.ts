import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseSectionDto, CourseSectionStatus, CourseSectionType } from '@shared/service-proxies/service-proxies';
import { CourseStructure } from '../curriculum/curriculum.component';
import { maxBy } from 'lodash';

@Component({
  selector: 'app-course-section',
  templateUrl: './course-section.component.html',
  styleUrls: ['./course-section.component.less']
})
export class CourseSectionComponent extends AppComponentBase implements OnInit {

  CourseStructure = CourseStructure;
  CourseSectionType = CourseSectionType;

  @Input() selectedStructure: CourseStructure;
  @Input() courseSection: CourseSectionDto = new CourseSectionDto();
  @Input() isTemporary: boolean;

  @Output() duplicate = new EventEmitter();
  @Output() editSection = new EventEmitter();
  @Output() addSection = new EventEmitter();
  @Output() deleteSection = new EventEmitter();
  @Output() removeTemporary = new EventEmitter();

  nameInput: string;

  CourseSectionStatus = CourseSectionStatus;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.nameInput = this.courseSection.name;
  }

  get isMiniStructure(): boolean { return this.selectedStructure === CourseStructure.Mini; }
  get isStandardStructure(): boolean { return this.selectedStructure === CourseStructure.Standard; }
  get lessonsCount(): number { return this.courseSection?.children?.length || 0; }
  get pollsCount(): number { return this.courseSection?.['polls']?.length || 0; }
  get filesCount(): number { return this.courseSection?.['files']?.length || 0; }
  get questionsCount(): number { return this.courseSection?.['questions']?.length || 0; }
  get offersCount(): number { return this.courseSection?.['offers']?.length || 0; }

  onBlurName() {
    if (this.nameInput) {
      this.courseSection.name = this.nameInput;
      this.addSection.emit(this.courseSection);
    } else {
      this.removeTemporary.emit(this.courseSection);
    }
  }

  onKeyPressName(event) {
    if (event.keyCode === 13) {
      event.target.blur();
    }
  }

  onKeyUpName(event) {
    if (event.keyCode === 27) {
      this.removeTemporary.emit(this.courseSection);
    }
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

  addTemporarySection(type: CourseSectionType): void {
    this.courseSection.children.push(CourseSectionDto.fromJS({
      parentId: this.courseSection.id,
      courseId: this.courseSection.courseId,
      displayOrder: (maxBy( this.courseSection.children, s => s?.displayOrder)?.displayOrder ?? 0) + 1,
      type
    }));
  }

  onRemoveTemporary(courseSection): void {
    this.courseSection.children = this.courseSection.children.filter(x => x.id !== courseSection.id);
  }
}
