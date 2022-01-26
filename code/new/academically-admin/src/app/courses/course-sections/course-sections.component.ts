import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseSectionsServiceProxy, CourseSectionDto, CourseDto } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CourseSectionService } from './_services/course-section.service';
import { AppConsts } from '@shared/AppConsts';

@Component({
  selector: 'app-course-sections',
  templateUrl: './course-sections.component.html',
  styleUrls: ['./course-sections.component.less'],
  animations: [appModuleAnimation()],
})
export class CourseSectionsComponent extends AppComponentBase implements OnInit {
  id: string;
  model = new CourseSectionDto();
  isLoading = false;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _courseSectionsService: CourseSectionsServiceProxy,
    private _courseSectionService: CourseSectionService,
  ) {
    super(injector);
    this.model.course = new CourseDto();
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('course-section-id')) {
        this.id = paramMap.get('course-section-id');
        this.getCourseSection();
      }
    });
  }

  ngOnInit(): void {
  }

  onSaveClick(): void {
    this._courseSectionService.courseSectionSave = true;
  }

  onLessonPreviewClick(): void {
    const url = `${AppConsts.appBaseUrl}/app/lesson-preview/${this.id}`;
    window.open(url, '_blank');
  }

  private getCourseSection(): void {
    this._courseSectionsService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.model = response;
        this._courseSectionService.courseSectionCreated = this.model;
      });
  }
}
