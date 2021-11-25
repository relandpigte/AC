import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentCoursesServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less']
})
export class LandingPageComponent extends AppComponentBase implements OnInit {
  id: string;
  isLoading = false;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _router: Router,
    private _studentCoursesService: StudentCoursesServiceProxy,
  ) {
    super(injector);
    this._route.parent.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('course-id')) {
        this.id = paramMap.get('course-id');
      }
    });
  }

  ngOnInit(): void {
  }

  onBuyNowClick(): void {
    this.isLoading = true;
    this._studentCoursesService.create(this.id)
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
}
