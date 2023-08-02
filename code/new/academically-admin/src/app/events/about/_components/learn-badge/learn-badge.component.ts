import { Component, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Injector } from '@node_modules/@angular/core';

@Component({
  selector: 'app-learn-badge',
  templateUrl: './learn-badge.component.html',
  styleUrls: ['./learn-badge.component.less']
})
export class LearnBadgeComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector
  ) {
    super(injector);
  }
  ngOnInit(): void {
  }

}
