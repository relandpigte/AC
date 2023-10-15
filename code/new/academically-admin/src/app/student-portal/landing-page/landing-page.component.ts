import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto, CoursesServiceProxy, CreateServicePurchaseDto, ServicesServiceProxy, ServicesType } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less']
})
export class LandingPageComponent extends AppComponentBase implements OnInit {
  id: string;
  isLoading = false;
  course: CourseDto;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _router: Router,
    private _servicesService: ServicesServiceProxy,
    private _coursesService: CoursesServiceProxy
  ) {
    super(injector);
    this._route.parent.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('course-id')) {
        this.id = paramMap.get('course-id');
      }
    });
  }

  ngOnInit(): void {
    this.initCourse();
  }

  onBuyNowClick(): void {
    this.isLoading = true;
    this._servicesService.savePurchase(CreateServicePurchaseDto.fromJS({
      referenceId: this.id,
      creatorUserId: this.appSession.userId,
      creationTime: moment(),
      ownerId: this.course?.creatorUser?.id,
      type: ServicesType.Course
    }))
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this._router.navigate([`/app/student-portal/${this.id}/home`]);
      });
  }

  private initCourse(): void {
    this._coursesService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(c => this.course = c);
  }
}
