import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.less'],
  animations: [appModuleAnimation()],
})
export class CreateProjectComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
