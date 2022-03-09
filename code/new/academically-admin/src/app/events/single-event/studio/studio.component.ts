import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-studio',
  templateUrl: './studio.component.html',
  styleUrls: ['./studio.component.less']
})
export class StudioComponent implements OnInit {

  activeTab = 1;
  presenters: Array<any> = [];
  constructor() { }

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
