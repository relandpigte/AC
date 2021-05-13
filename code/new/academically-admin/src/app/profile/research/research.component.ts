import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-profile-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.less']
})
export class ResearchComponent extends AppComponentBase {

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

}
