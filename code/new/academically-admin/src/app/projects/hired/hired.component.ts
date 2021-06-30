import { Component, Injector, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-hired',
  templateUrl: './hired.component.html',
  styleUrls: ['./hired.component.less'],
  animations: [appModuleAnimation()],
})
export class HiredComponent extends AppComponentBase implements OnInit {

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
