import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'profile-areas-of-study',
  templateUrl: './profile-areas-of-study.component.html',
  styleUrls: ['./profile-areas-of-study.component.less'],
})
export class ProfileAreasOfStudyComponent extends AppComponentBase implements OnInit {
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {}
}
