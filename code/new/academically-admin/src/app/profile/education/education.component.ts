import { Component, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.less']
})
export class EducationComponent extends AppComponentBase {
  constructor(
    injector: Injector,
  ) {
    super(injector);
  }
}
