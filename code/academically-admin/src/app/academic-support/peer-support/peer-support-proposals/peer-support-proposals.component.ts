import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'peer-support-proposals',
  templateUrl: './peer-support-proposals.component.html',
  styleUrls: ['./peer-support-proposals.component.less'],
  animations: [appModuleAnimation()]
})
export class PeerSupportProposalsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
