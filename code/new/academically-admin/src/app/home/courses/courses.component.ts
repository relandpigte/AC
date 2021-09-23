import { Component, OnInit, Injector } from '@angular/core';
import { ModalOptions } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CourseWizardComponent } from './course-wizard/course-wizard.component';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.less']
})
export class CoursesComponent extends AppComponentBase implements OnInit {
  courses = [{ 'courseName': 'English', 'createdAt': '2021-05-02', 'status': true, 'categories': 'Test' },
  { 'courseName': 'C#', 'createdAt': '2021-05-02', 'status': false, 'categories': 'Test' },
  { 'courseName': 'C', 'createdAt': '2021-08-02', 'status': true, 'categories': 'Test' },
  { 'courseName': 'C++', 'createdAt': '2021-02-02', 'status': true, 'categories': 'Test' },
  { 'courseName': 'Java', 'createdAt': '2021-01-02', 'status': false, 'categories': 'Test' }];

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onCreateClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CourseWizardComponent>;
    this._modalService.show(CourseWizardComponent, modalSettings);
  }
}
