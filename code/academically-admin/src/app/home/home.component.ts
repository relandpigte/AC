import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  animations: [appModuleAnimation()]
})
export class HomeComponent extends AppComponentBase implements OnInit {
  activeTab: string;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.activeTab = 'Dashboard';
  }

  onToggleClick(value) {
    this.activeTab = value;
  }
}
