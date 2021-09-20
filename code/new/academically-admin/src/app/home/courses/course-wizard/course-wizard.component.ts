import { Component, OnInit, } from '@angular/core';

@Component({
  selector: 'app-course-wizard',
  templateUrl: './course-wizard.component.html',
  styleUrls: ['./course-wizard.component.less']
})
export class CourseWizardComponent implements OnInit {
  stepper: number = 1;
  constructor() { }

  ngOnInit(): void {
  }

  courseTemplateChangedHandler(templateId: number) {
    if (templateId) {
      this.stepper = this.stepper + 1;
    }
  }
}
