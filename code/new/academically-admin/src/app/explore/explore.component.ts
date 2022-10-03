import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.less'],
  animations: [appModuleAnimation()],
})
export class ExploreComponent extends AppComponentBase implements OnInit {
  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  get heroBannerSrc(): string { return `https://picsum.photos/500`; }
}
