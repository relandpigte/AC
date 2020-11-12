import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.less'],
  animations: [appModuleAnimation()]
})
export class ErrorPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
