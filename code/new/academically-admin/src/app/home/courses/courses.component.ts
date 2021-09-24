import { Component, OnInit, Injector } from '@angular/core';
import { ModalOptions } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CourseWizardComponent } from './course-wizard/course-wizard.component';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto, CoursesServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.less']
})
export class CoursesComponent extends AppComponentBase implements OnInit {
  courses: CourseDto[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _coursesService: CoursesServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getCourses();
  }

  onCreateClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CourseWizardComponent>;
    this._modalService.show(CourseWizardComponent, modalSettings);
  }

  private getCourses(): void {
    this.isLoading = true;
    this._coursesService.getAll()
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(courses => {
        this.courses = courses;
      });
  }
}
