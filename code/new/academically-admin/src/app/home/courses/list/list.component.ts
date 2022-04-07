import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent extends AppComponentBase implements OnInit {

  @Input() courses: CourseDto[] = [];
  @Output() visitCourse = new EventEmitter<CourseDto>();
  constructor(injector: Injector) {
    super(injector);
   }
  ngOnInit(): void {
  }

  onVisitCourseClick(course: CourseDto) {
    this.visitCourse.emit(course);
  }

}
