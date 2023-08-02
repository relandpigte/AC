import { Component, OnInit } from '@angular/core';
import { Injector } from '@node_modules/@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-instructor-badge',
  templateUrl: './instructor-badge.component.html',
  styleUrls: ['./instructor-badge.component.less']
})
export class InstructorBadgeComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  get profilePictureUrl(): string { return this.appSession.user.profilePictureUrl; }
  get profileFullName(): string { return `${this.appSession.user.name} ${this.appSession.user.surname}`; }

  ngOnInit(): void {
  }

}
