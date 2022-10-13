import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.less'],
  animations: [appModuleAnimation()],
})
export class CommunityComponent extends AppComponentBase implements OnInit {

  selectedTopics: string[] = [];

  get topics(): string[] { return ['Test', 'Sample 10122022', 'Astronomy', 'Biology', 'Fiction']; }

  constructor(injector: Injector,) {
    super(injector);
  }

  ngOnInit(): void {
  }

  handleFilterTopics(topics: string[]): void {
    this.selectedTopics = topics;
  }

}
