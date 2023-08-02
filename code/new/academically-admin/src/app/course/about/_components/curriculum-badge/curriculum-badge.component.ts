import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-curriculum-badge',
  templateUrl: './curriculum-badge.component.html',
  styleUrls: ['./curriculum-badge.component.less']
})
export class CurriculumBadgeComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
