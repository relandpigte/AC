import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-profile-research',
  templateUrl: './profile-research.component.html',
  styleUrls: ['./profile-research.component.less']
})
export class ProfileResearchComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
