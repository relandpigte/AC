import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseSectionsServiceProxy, CourseSectionDto, CourseDto, CourseSectionPagesServiceProxy, CourseSectionPageDto } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PageBuilderService } from './_services/page-builder.service';
import { ContentComponent } from './_components/content/content.component';
import { SettingsComponent } from './_components/settings/settings.component';
import { DetailsComponent } from './_components/details/details.component';
import { PagebuilderTabs } from './_models/pagebuilderTabs.enum'
import { AppConsts } from '@shared/AppConsts';

@Component({
  selector: 'app-page-builder',
  templateUrl: './page-builder.component.html',
  styleUrls: ['./page-builder.component.less'],
  animations: [appModuleAnimation()],
})

export class PageBuilderComponent extends AppComponentBase implements OnInit {
  @ViewChild(ContentComponent, { static: true }) contentComponent: ContentComponent;
  @ViewChild(SettingsComponent, { static: true }) settingsComponent: SettingsComponent;
  @ViewChild(DetailsComponent, { static: true }) detailComponent: DetailsComponent;

  id: string;
  model = new CourseSectionDto();
  isLoading = false;
  isSaving = false;
  PagebuilderTabs = PagebuilderTabs;
  currentActiveTab = PagebuilderTabs.Details;

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
        this.getCourseSectionPages();
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
    const url = `${AppConsts.appBaseUrl}/pages/lesson-preview/${this.id}`;
    console.log(url);
    window.open(url, '_blank');
  }

  onSaveClick(): void {
    this.isSaving = true;
    if (this.currentActiveTab === PagebuilderTabs.Content) {
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
    } else if (this.currentActiveTab === PagebuilderTabs.Details) {
      this._courseSectionsService.update(this.detailComponent.prepareContentsForSaving()).pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isSaving = false;
        })
      )
        .subscribe(() => {
          this.notify.success(this.l('SavedSuccessfully'));
          this._router.navigate(['/app/courses/', this.model.courseId], { fragment: 'curriculum' });
        });

      var courseSectionPage = this.detailComponent.prepareContentsForCoursePage()
      this._courseSectionPagesService.saveUpdateDetails(
        this.contentComponent.preparepageContentForSaving(),
        courseSectionPage.description,
        courseSectionPage.categoriesTags,
        courseSectionPage.duration,
        this.detailComponent.prepareContentsForImage(),
        this.id,
        courseSectionPage.id
      )
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isSaving = false;
          })
        )
        .subscribe(() => {
          this.notify.success(this.l('SavedSuccessfully'));
          this._router.navigate(['/app/page-builder/', this.id]);
        });
    } else if (this.currentActiveTab === PagebuilderTabs.Settings) {
      this._courseSectionsService.update(this.settingsComponent.prepareContentsForSaving())
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isSaving = false;
          })
        )
        .subscribe(() => {
          this.notify.success(this.l('SavedSuccessfully'));
          this._router.navigate(['/app/page-builder/', this.id], { fragment: 'Settings' });
        });
    }
  }

  onTabClick(currentTab): void {
    switch (currentTab) {
      case PagebuilderTabs.Content:
        this.currentActiveTab = PagebuilderTabs.Content
        break
      case PagebuilderTabs.Details:
        this.currentActiveTab = PagebuilderTabs.Details
        break
      case PagebuilderTabs.Settings:
        this.currentActiveTab = PagebuilderTabs.Settings
        break
    }
  }

  private getCourseSection(): void {
    this.isLoading = true;
    this._courseSectionsService.get(this.id)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(response => {
        this._pageBuilderService.courseSection = response;

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
          this._pageBuilderService.courseSectionPage = response;
        }
        this.contentComponent.initializeContentManager();
      });
  }
}
