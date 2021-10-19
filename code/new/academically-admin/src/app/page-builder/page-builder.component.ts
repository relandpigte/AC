import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseSectionsServiceProxy, CourseSectionDto, CourseDto, CourseSectionPagesServiceProxy, CourseSectionPageDto } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PageBuilderService } from './_services/page-builder.service';
import { ContentComponent } from './_components/content/content.component';

@Component({
  selector: 'app-page-builder',
  templateUrl: './page-builder.component.html',
  styleUrls: ['./page-builder.component.less'],
  animations: [appModuleAnimation()],
})
export class PageBuilderComponent extends AppComponentBase implements OnInit {
  @ViewChild(ContentComponent, { static: true }) contentComponent: ContentComponent;

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
    private _courseSectionPagesService: CourseSectionPagesServiceProxy,
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
    this._courseSectionPagesService.save(this.contentComponent.prepareContentsForSaving(this.id))
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        this._router.navigate(['/app/courses/', this.model.courseId], { fragment: 'curriculum' });
      });
  }

  private getCourseSection(): void {
    this.isLoading = true;
    this._courseSectionsService.get(this.id)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(response => {
        this._pageBuilderService.courseSection = response;
        this.getCourseSectionPages();
      });
  }

  private getCourseSectionPages(): void {
    this._courseSectionPagesService.get(this.id)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(response => {
        if (response && response.pageContent) {
          this.contentComponent.courseSectionPage = response;
        }
        this.contentComponent.initializeContentManager();
      });
  }
}
