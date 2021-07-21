import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UserEducationCourseDto } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CreateEditCourseComponent } from './create-edit-course/create-edit-course.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.less']
})
export class CoursesComponent extends AppComponentBase implements OnInit {
  @Input() userEducationCourses: UserEducationCourseDto[] = [];

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onAddLevelClick(): void {
    this.showCreateEditCourseModal();
  }

  onEditLevelClick(model: UserEducationCourseDto): void {
    this.showCreateEditCourseModal(model);
  }

  onRemoveLevelClick(model: UserEducationCourseDto): void {
    const index = this.userEducationCourses.findIndex(e => e === model);
    if (index >= 0) {
      this.userEducationCourses.splice(index, 1);
    }
  }

  private showCreateEditCourseModal(userEducationCourse?: UserEducationCourseDto) {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      model: userEducationCourse,
    };
    const modalRef = this._modalService.show(CreateEditCourseComponent, modalSettings);
    const modal: CreateEditCourseComponent = modalRef.content;
    modal.userEducationLevelSaved.subscribe((course: UserEducationCourseDto) => {
      const index = this.userEducationCourses.findIndex(e => e === course);
      if (index < 0) {
        this.userEducationCourses.push(course);
      }
    });
  }
}
