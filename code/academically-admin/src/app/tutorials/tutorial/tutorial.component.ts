import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.less'],
  animations: [appModuleAnimation()],
})
export class TutorialComponent extends AppComponentBase implements OnInit {
  id: string;

  constructor(injector: Injector, private _activatedRoute: ActivatedRoute) {
    super(injector);
  }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((paramMap) => {
      this.id = paramMap.get('id');
    });
  }
}
