import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-tutor-wizard',
  templateUrl: './tutor-wizard.component.html',
  styleUrls: ['./tutor-wizard.component.less'],
  animations: [appModuleAnimation()],
})
export class TutorWizardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
