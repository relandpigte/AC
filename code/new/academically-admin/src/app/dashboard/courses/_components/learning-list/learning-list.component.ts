import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { StudentCourseDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-learning-list',
  templateUrl: './learning-list.component.html',
  styleUrls: ['./learning-list.component.less']
})
export class LearningListComponent extends AppComponentBase implements OnInit {

  @Input() studentCourses: StudentCourseDto[] = [];
  constructor(injector: Injector) {
    super(injector);
   }

  ngOnInit(): void {
  }

}
