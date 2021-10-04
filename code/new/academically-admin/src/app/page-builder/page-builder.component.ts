import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseSectionsServiceProxy, CourseSectionDto, CourseDto } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PageBuilderService } from './_services/page-builder.service';

@Component({
  selector: 'app-page-builder',
  templateUrl: './page-builder.component.html',
  styleUrls: ['./page-builder.component.less'],
  animations: [appModuleAnimation()],
})
export class PageBuilderComponent extends AppComponentBase implements OnInit {
  id: string;
  model = new CourseSectionDto();
  isLoading = false;
  isSaving = false;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _router: Router,
    private _pageBuilderService: PageBuilderService,
    private _courseSectionsService: CourseSectionsServiceProxy,
  ) {
    super(injector);
    this.model.course = new CourseDto();
    this._route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
        this.getCourseSection();
      }
    });
  }

  ngOnInit(): void {
    this._pageBuilderService.courseSection$
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(courseSection => {
        this.model = courseSection;
      });
  }

  onLessonPreviewClick(): void {
    this.message.info('Coming Soon!');
  }

  onSaveClick(): void {
    this.isSaving = true;
    setTimeout(() => {
      this.isSaving = false;
      this.notify.success(this.l('SavedSuccessfully'));
      this._router.navigate(['/app/courses/', this.model.courseId], { fragment: 'curriculum' });
    }, 1000);
  }

  private getCourseSection(): void {
    this.isLoading = true;
    this._courseSectionsService.get(this.id)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        this._pageBuilderService.courseSection = response;
      });
  }
}
