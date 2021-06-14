import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';

import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-service-wizard',
  templateUrl: './service-wizard.component.html',
  styleUrls: ['./service-wizard.component.less'],
  animations: [appModuleAnimation()],
})
export class  ServiceWizardComponent extends AppComponentBase implements OnInit {

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
