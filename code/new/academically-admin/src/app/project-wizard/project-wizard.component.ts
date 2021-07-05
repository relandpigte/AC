import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';

import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-service-wizard',
  templateUrl: './project-wizard.component.html',
  styleUrls: ['./project-wizard.component.less'],
  animations: [appModuleAnimation()],
})
export class  ProjectWizardComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _router: Router,
    private _route: ActivatedRoute,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }
}
