import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from './_services/course.service';
import { CoursesServiceProxy, CourseDto } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';

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

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _coursesService: CoursesServiceProxy,
    private _courseService: CourseService,
  ) {
    super(injector);
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
