import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UserFollowersServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-learner',
  templateUrl: './learner.component.html',
  styleUrls: ['./learner.component.less']
})
export class LearnerComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _userFollowersService: UserFollowersServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
