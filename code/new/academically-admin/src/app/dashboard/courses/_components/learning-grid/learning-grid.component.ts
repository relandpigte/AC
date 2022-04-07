import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { StudentCourseDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-learning-grid',
  templateUrl: './learning-grid.component.html',
  styleUrls: ['./learning-grid.component.less']
})
export class LearningGridComponent extends AppComponentBase implements OnInit {

  @Input() studentCourses: StudentCourseDto[] = [];
  constructor(injector: Injector) {
    super(injector);
   }
  ngOnInit(): void {
  }



}
