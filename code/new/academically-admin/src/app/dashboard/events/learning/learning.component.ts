import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.less']
})
export class LearningComponent extends AppComponentBase {
  constructor(
    injector: Injector
  ) {
    super(injector);
  }
}
