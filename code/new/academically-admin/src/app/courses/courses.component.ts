import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from './_services/course.service';
import { CoursesServiceProxy, CourseDto, CourseStatus, ServicesType } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { CommunityPostService } from '@shared/services/community-post.service';
import { MenuItem, ServiceCreateService } from '@shared/services/service-create.service';

enum CourseTab {
  Details = 'details',
  Curriculum = 'curriculum',
  Settings = 'settings',
  LandingPage = 'landing-page',
}

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.less'],
  animations: [appModuleAnimation()],
})
export class CoursesComponent extends AppComponentBase implements OnInit, OnDestroy {
  id: string;
  course: CourseDto = new CourseDto;
  currentTab = CourseTab.Details;
  CourseTab = CourseTab;
  CourseStatus = CourseStatus;
  defaultMenuItem: MenuItem;
  menuItems: MenuItem[] = [
    {
      id: 'details',
      label: 'Details',
      icon: 'assets/img/service/create/list.svg',
      iconHover: 'assets/img/service/create/list-hover.svg',
      infoText: 'Here, you can input all the details for your article. This information will be visible to potential clients, so keep it clear and informative.'
    },
    {
      id: 'curriculum',
      label: 'Curriculum',
      icon: 'assets/img/service/create/layers.svg',
      iconHover: 'assets/img/service/create/layers-hover.svg',
      infoText: 'Here 2, you can input all the details for your article. This information will be visible to potential clients, so keep it clear and informative.'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'assets/img/service/create/settings.svg',
      iconHover: 'assets/img/service/create/settings-hover.svg',
    },
  ];

  readonly ServicesType = ServicesType;
  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _coursesService: CoursesServiceProxy,
    private _courseService: CourseService,
    private _modalDialogService: ModalDialogService,
    private _communityPostService: CommunityPostService,
    private _serviceCreateService: ServiceCreateService
  ) {
    super(injector);
    this._serviceCreateService.setDefaultMenuItem(this.menuItems[0]);
    this._serviceCreateService.getDefaultMenuItem().subscribe(x => this.defaultMenuItem = x);
    this._route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
        this.getCourse();
      }
    });
    this._route.fragment.subscribe(fragment => {
      if (fragment) {
        this.currentTab = fragment as CourseTab;
      }
    });
  }

  ngOnInit(): void {
    this._courseService.course$
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(course => {
        this.course = course;
      });
  }

  ngOnDestroy(): void {
    this._courseService.course = new CourseDto();
  }

  onPublishClick(): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('PublishCourseConfirmationMessage'),
      confirmCb: (): void => {
        this._coursesService.updateStatus(this.course.id, CourseStatus.Published)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.course.status = CourseStatus.Published;
            this.notify.success(this.l('SavedSuccessfully'))
            this._communityPostService.hasNewItemToShare({ serviceId: this.course.id });
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  onUnpublishClick(): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('UnpublishCourseConfirmationMessage'),
      confirmCb: (): void => {
        this._coursesService.updateStatus(this.course.id, CourseStatus.Draft)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.course.status = CourseStatus.Draft;
            this.notify.success(this.l('SavedSuccessfully'))
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  private getCourse(): void {
    this._coursesService.get(this.id)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(course => {
        this._courseService.course = course;
      });
  }
}
