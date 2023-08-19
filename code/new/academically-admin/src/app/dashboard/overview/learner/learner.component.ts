import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-learner',
  templateUrl: './learner.component.html',
  styleUrls: ['./learner.component.less']
})
export class LearnerComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
