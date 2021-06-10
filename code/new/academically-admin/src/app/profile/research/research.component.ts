import { Component, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { InterestsComponent } from './_components/interests/interests.component';
import { MethodologiesComponent } from './_components/methodologies/methodologies.component';
import { PublicationsComponent } from './_components/publications/publications.component';

@Component({
  selector: 'app-profile-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.less']
})
export class ResearchComponent extends AppComponentBase {
  @ViewChild('interests') interests: InterestsComponent;
  @ViewChild('methodologies') methodologies: MethodologiesComponent;
  @ViewChild('publications') publications: PublicationsComponent;

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

}
