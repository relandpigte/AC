import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.less'],
  animations: [appModuleAnimation()]
})
export class ProposalsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
