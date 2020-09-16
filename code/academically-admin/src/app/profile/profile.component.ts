import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { AppSessionService } from '@shared/session/app-session.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
  animations: [appModuleAnimation()]
})
export class ProfileComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    ) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
