import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { LessonWizardComponent } from '../lesson-wizard/lesson-wizard.component';
import { CourseSectionDto, CourseSectionsServiceProxy, CourseSectionStatus, CourseSectionType } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import { CourseEllipseState } from './../../_models/courseEllipseType';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.less']
})
export class CurriculumComponent extends AppComponentBase implements OnInit {
  @Input() courseId: string;

  courseSections: CourseSectionDto[];
  isLoading = false;
  CourseSectionStatus = CourseSectionStatus;
  courseSectionType = CourseSectionType;
  CourseEllipseState = CourseEllipseState;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _courseSectionsService: CourseSectionsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getCourseSections();
  }

  onAddEditCourseSectionClick(courseSectionType: CourseSectionType, courseSection?: CourseSectionDto, courseEllipseState?: CourseEllipseState): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<LessonWizardComponent>;
    var model = new CourseSectionDto();
    if (courseSection) {
      if (courseSection.type === courseSectionType) {
        model = courseSection;
      }
    }
    modalSettings.initialState = {
      courseId: this.courseId,
      courseSectionType: courseSectionType,
      parentId: (courseSection === null || courseSection === undefined) ? null : courseSection.id,
      model: model,
      courseEllipseState: courseEllipseState
    };
    const modal = this._modalService.show(LessonWizardComponent, modalSettings).content;
    modal.courseSaved
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.getCourseSections();
      });
  }

  onDeleteClick(id): void {
    this.message.confirm(
      this.l('DeleteCourseSection'),
      undefined,
      (result: boolean) => {
        if (result) {
          this._courseSectionsService.delete(id)
            .subscribe(() => {
              this.notify.success(this.l('SuccessfullyDeleted'));
              this.getCourseSections();
            });
        }
      }
    );
  }

  onDuplicateClick(courseSection): void {
    this.isLoading = true;
    this._courseSectionsService.createDuplicate(courseSection)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(result => {
        this.notify.success(this.l('SuccessfullyDuplicateCreated'));
        this.getCourseSections();
      });
  }

  private getCourseSections(): void {
    this.isLoading = true;
    this._courseSectionsService.getAll(this.courseId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(courseSections => {
        this.courseSections = courseSections;
      });
  }
}
