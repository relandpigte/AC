import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-teaching-grid',
  templateUrl: './teaching-grid.component.html',
  styleUrls: ['./teaching-grid.component.less']
})
export class TeachingGridComponent extends AppComponentBase implements OnInit {

  @Input() courses: CourseDto[] = [];
  @Output() deleteCourse = new EventEmitter<string>();
  constructor(injector: Injector) {
    super(injector);
   }
  ngOnInit(): void {
  }

  onDeleteClick(id: string) {
    this.deleteCourse.emit(id);
  }



}
