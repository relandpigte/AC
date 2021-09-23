import { Component, OnInit, Output, EventEmitter, Injector } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CourseDto, CoursesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-course-name',
  templateUrl: './course-name.component.html',
  styleUrls: ['./course-name.component.less']
})

export class CourseNameComponent extends AppComponentBase implements OnInit {
  model: CourseDto = new CourseDto();
  isLoading = false;
  @Output() backBtnClicked: EventEmitter<any> = new EventEmitter();
  @Output() courseSaved: EventEmitter<CourseDto> = new EventEmitter();

  constructor(
    injector: Injector,
    private _coursesService: CoursesServiceProxy,
    private _modal: BsModalRef,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onBackClick() {
    this.backBtnClicked.emit(true);
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onSubmitClick() {
    this.isLoading = true;
    this._coursesService
      .create(this.model)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((result) => {
        this._modal.hide();
        this.notify.success(this.l('SavedSuccessfully'));
      });
  }
}
