import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-studio',
  templateUrl: './studio.component.html',
  styleUrls: ['./studio.component.less']
})
export class StudioComponent extends AppComponentBase implements OnInit {

  activeTab = 1;
  presenters: Array<any> = [];
  constructor(injector: Injector,
    ) {
    super(injector);

  }

  ngOnInit(): void {
    this.presenters = [{
      imageUrl : 'assets/img/anonymous.png',
      name : 'Diana Smiley'
    }, {
      imageUrl : 'assets/img/anonymous.png',
      name : 'Ab Hadley'
    }, {
      imageUrl : 'assets/img/anonymous.png',
      name : 'Adolfo Hell'
    }, {
      imageUrl : 'assets/img/anonymous.png',
      name : 'Daniele Dewitt'
    }];
  }

  changeActiveTab(value: number) {
    this.activeTab = value;
  }

}
