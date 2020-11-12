import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-student-proposal',
  templateUrl: './student-proposal.component.html',
  styleUrls: ['./student-proposal.component.less'],
  animations: [appModuleAnimation()]
})
export class StudentProposalComponent extends AppComponentBase implements OnInit {
  constructor(injector: Injector) {
    super(injector);
  }
  ngOnInit(): void {}

  onScrollClick(e: any, el: HTMLElement): void {
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
