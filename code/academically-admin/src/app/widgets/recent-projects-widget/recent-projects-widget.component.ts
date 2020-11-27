import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UserTutorialDto, UserTutorialsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'recent-projects-widget',
  templateUrl: './recent-projects-widget.component.html',
  styleUrls: ['./recent-projects-widget.component.less'],
})
export class RecentProjectsWidgetComponent extends AppComponentBase implements OnInit {
  tutorials: UserTutorialDto[] = [];

  constructor(injector: Injector, private _userTutorialsServiceProxy: UserTutorialsServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.getTutorials();
  }

  private getTutorials(): void {
    this._userTutorialsServiceProxy.getRecent().subscribe((tutorials) => {
      this.tutorials = tutorials;
    });
  }
}
