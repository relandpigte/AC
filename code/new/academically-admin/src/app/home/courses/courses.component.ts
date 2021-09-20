import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CourseWizardComponent } from './course-wizard/course-wizard.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.less']
})
export class CoursesComponent implements OnInit {
  courses = [{ 'courseName': 'English', 'createdAt': '2021-05-02', 'status': true, 'categories': 'Test' },
  { 'courseName': 'C#', 'createdAt': '2021-05-02', 'status': false, 'categories': 'Test' },
  { 'courseName': 'C', 'createdAt': '2021-08-02', 'status': true, 'categories': 'Test' },
  { 'courseName': 'C++', 'createdAt': '2021-02-02', 'status': true, 'categories': 'Test' },
  { 'courseName': 'Java', 'createdAt': '2021-01-02', 'status': false, 'categories': 'Test' }]
  constructor(
    private _modalService: BsModalService,
    ) { }

  ngOnInit(): void {
  }
  onCreateClick(): void {
    this.showCourseDialog();
  }

  private showCourseDialog(): void {
    let createcourseDialog: BsModalRef;
      createcourseDialog = this._modalService.show(
        CourseWizardComponent,
        {
          class: 'modal-lg',
        }
      );
  }
}
