import { Component, OnInit, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-peer-support',
  templateUrl: './peer-support.component.html',
  styleUrls: ['./peer-support.component.less'],
  animations: [appModuleAnimation()]
})
export class PeerSupportComponent implements OnInit {
  constructor(
  ) {
  }

  ngOnInit(): void {
  }

}
