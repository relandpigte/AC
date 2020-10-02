import { Component, OnInit, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-academic-support',
  templateUrl: './academic-support.component.html',
  styleUrls: ['./academic-support.component.less'],
  animations: [appModuleAnimation()]
})
export class AcademicSupportComponent implements OnInit {
  constructor(
  ) {
  }

  ngOnInit(): void {
  }

}
