import { Component, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PublicationsComponent } from './_components/publications/publications.component';

@Component({
  selector: 'app-profile-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.less']
})
export class ResearchComponent extends AppComponentBase {
  @ViewChild('publications') public publications: PublicationsComponent;

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

}
