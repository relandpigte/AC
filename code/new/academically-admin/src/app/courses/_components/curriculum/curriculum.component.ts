import { Component, OnInit, Injector, Input, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { LessonWizardComponent } from '../lesson-wizard/lesson-wizard.component';
import { CourseSectionDto, CourseSectionsServiceProxy, CourseSectionStatus, CourseSectionType } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import { DragulaService } from 'ng2-dragula';
import { CourseEllipseState } from './../../_models/courseEllipseType';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.less']
})
export class CurriculumComponent extends AppComponentBase implements OnInit, OnDestroy {
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
    private dragulaService: DragulaService
  ) {
    super(injector);
    this.dragulaService.createGroup("Course", {
      revertOnSpill: true,
    });

    this.dragulaService.dropModel("Course").subscribe(args => {
      var parentId = args.target.id;
      const _index = [].slice.call(args.el.parentNode.children).findIndex((x) => args.el === x);
      if (args.item.id === parentId
        && args.item.type === args.target['type']
        || (args.item.type === CourseSectionType.Module && (args.target["type"] === CourseSectionType.Unit || CourseSectionType.Lesson))
        || (args.item.type === CourseSectionType.Unit && parentId === "" && (args.target["type"] === undefined || CourseSectionType.Unit || CourseSectionType.Lesson))) {

        if (parentId === "" && args.item.type === CourseSectionType.Module) {
          this.updateCourseSectionParent(args.item.id, _index + 1, parentId)
        }
        else {
          this.dragulaService.find('Course').drake.cancel(true);

          args.sourceModel.splice(args.sourceIndex, 0, ...args.targetModel.splice(args.targetIndex, 1));
        }
      } else {
        this.updateCourseSectionParent(args.item.id, _index + 1, parentId)
      }
    });
  }

  ngOnInit(): void {
    this.getCourseSections();
  }

  ngOnDestroy(): void {
    this.dragulaService.destroy("Course");
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

  private updateCourseSectionParent(currentId, index, parentId?): void {
    this.isLoading = true;
    this._courseSectionsService.updateCourseSectionParent(currentId, parentId, index)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(courseSections => {
        this.notify.success(this.l('SavedSuccessfully'))
      });
  }
}
