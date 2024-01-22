import { Component, OnInit, Injector, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { LessonWizardComponent } from '../lesson-wizard/lesson-wizard.component';
import { CourseSectionDto, CourseSectionsServiceProxy, CourseSectionStatus, CourseSectionType } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import { DragulaService } from 'ng2-dragula';
import { CourseEllipseState } from './../../_models/courseEllipseType';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { maxBy } from 'lodash';

export enum CourseStructure {
  Mini = 'mini',
  Standard = 'standard',
}

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.less']
})
export class CurriculumComponent extends AppComponentBase implements OnInit, OnDestroy {
  @Input() courseId: string;

  courseSections: CourseSectionDto[];

  isLoading = false;
  selectedStructure: CourseStructure;

  CourseStructure = CourseStructure;
  CourseSectionStatus = CourseSectionStatus;
  CourseSectionType = CourseSectionType;
  CourseEllipseState = CourseEllipseState;

  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef,
    private _modalService: BsModalService,
    private _courseSectionsService: CourseSectionsServiceProxy,
    private dragulaService: DragulaService,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
    this.dragulaService.createGroup('Course', {
      revertOnSpill: true,
      moves: (el: any) => {
        if (el?.getAttribute('temporary') === 'true') return false;
        return true;
      }
    });

    this.dragulaService.dropModel('Course').subscribe(args => {
      const parentId = args.target.id;
      const _index = [].slice.call(args.el.parentNode.children).findIndex((x) => args.el === x);
      if (args.item.id === parentId
        && args.item.type === args.target['type']
        || (args.item.type === CourseSectionType.Module && (args.target['type'] === CourseSectionType.Unit || CourseSectionType.Lesson))
        || (args.item.type === CourseSectionType.Unit && parentId === '' &&
        (args.target['type'] === undefined || CourseSectionType.Unit || CourseSectionType.Lesson))) {

        if (parentId === '' && args.item.type === CourseSectionType.Module) {
          this.updateCourseSectionParent(args.item.id, _index + 1, parentId);
        } else {
          this.dragulaService.find('Course').drake.cancel(true);

          args.sourceModel.splice(args.sourceIndex, 0, ...args.targetModel.splice(args.targetIndex, 1));
        }
      } else {
        this.updateCourseSectionParent(args.item.id, _index + 1, parentId);
      }
    });
  }

  ngOnInit(): void {
    this.getCourseSections();
  }

  ngOnDestroy(): void {
    this.dragulaService.destroy('Course');
  }

  get isMiniStructure(): boolean { return this.selectedStructure === CourseStructure.Mini; }
  get isStandardStructure(): boolean { return this.selectedStructure === CourseStructure.Standard; }

  addTemporarySection(type: CourseSectionType): void {
    this.courseSections.push(CourseSectionDto.fromJS({
      courseId: this.courseId,
      displayOrder: maxBy(this.courseSections, s => s.displayOrder).displayOrder + 1,
      type
    }));
  }

  editSection(courseSection) {
    this.onAddEditCourseSectionClick(courseSection.type, courseSection, CourseEllipseState.Rename);
  }

  addSection(courseSection) {
    this.isLoading = true;
    this._courseSectionsService.create(courseSection)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.getCourseSections();
      });
    // this.onAddEditCourseSectionClick(this.courseSectionType.Lesson, courseSection);
  }

  onCourseStructureClick(structure: CourseStructure): void {
    this.selectedStructure = structure;
  }

  onAddEditCourseSectionClick(courseSectionType: CourseSectionType, courseSection?:
    CourseSectionDto, courseEllipseState?: CourseEllipseState): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<LessonWizardComponent>;
    let model = new CourseSectionDto();
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

  onRemoveTemporary(courseSection): void {
    this.courseSections = this.courseSections.filter(x => x.id !== courseSection.id);
  }

  onDeleteClick(id): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('DeleteCourseSection'),
      confirmCb: (): void => {
        this._courseSectionsService.delete(id)
          .subscribe(() => {
            this.notify.success(this.l('SuccessfullyDeleted'));
            this.getCourseSections();
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }


  onDuplicateClick(courseSection): void {
    this.isLoading = true;
    const clonedCourseSection = this.duplicateCourseSection(courseSection);
    this._courseSectionsService.createDuplicate(clonedCourseSection)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(result => {
        this.notify.success(this.l('Successfully Duplicate Created'));
        this.getCourseSections();
      });
  }

  private duplicateCourseSection(courseSection: CourseSectionDto): CourseSectionDto {
    let newCourseSection: CourseSectionDto = courseSection.clone();
    this.clearIdsOfClonedCourseSection(newCourseSection);
    return newCourseSection;
  }

  private clearIdsOfClonedCourseSection(courseSection: CourseSectionDto): void {
    delete courseSection.id;
    courseSection.children.forEach(child => {
      this.clearIdsOfClonedCourseSection(child);
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

        // set selected course structure if we already have course sections defined
        if (this.courseSections?.length) {
          this.selectedStructure = this.courseSections.some(s => s.type === CourseSectionType.Module) ? CourseStructure.Standard : CourseStructure.Mini;
          this._cdr.detectChanges();
        }
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
