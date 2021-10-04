import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { LessonWizardComponent } from '../lesson-wizard/lesson-wizard.component';
import { CourseSectionDto, CourseSectionsServiceProxy, CourseSectionStatus, CourseSectionType } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';

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

  onAddCourseSectionClick(courseSectionType: CourseSectionType): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<LessonWizardComponent>;
    modalSettings.initialState = {
      courseId: this.courseId,
      courseSectionType: courseSectionType
    };
    const modal = this._modalService.show(LessonWizardComponent, modalSettings).content;
    modal.courseSaved
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
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
