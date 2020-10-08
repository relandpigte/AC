import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less'],
  animations: [appModuleAnimation()]
})
export class SettingsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
