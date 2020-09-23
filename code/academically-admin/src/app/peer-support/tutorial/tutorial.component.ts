import { Component, OnInit, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.less'],
  animations: [appModuleAnimation()]
})
export class TutorialComponent implements OnInit {
  constructor(
  ) {
  }

  ngOnInit(): void {
  }

}
