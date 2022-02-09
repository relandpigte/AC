import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.less'],
  animations: [appModuleAnimation()],
})
export class UsageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
