import { Component, OnInit, Injector, } from '@angular/core';
import { CourseDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-course-wizard',
  templateUrl: './course-wizard.component.html',
  styleUrls: ['./course-wizard.component.less']
})
export class CourseWizardComponent extends AppComponentBase implements OnInit {
  currentStep = 1;

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  courseTemplateChangedHandler(templateId: number) {
    if (templateId) {
      this.setStepperIncrement();
    }
  }

  courseNameBackBtnClickedHandler(event) {
    if (event) {
      this.setStepperDecrement();
    }
  }

  onCourseSaved(course: CourseDto) {
    if (course) {
      this.setStepperIncrement();
    }
  }

  setStepperIncrement() {
    this.currentStep += 1;
  }

  setStepperDecrement() {
    this.currentStep -= 1;
  }
}
