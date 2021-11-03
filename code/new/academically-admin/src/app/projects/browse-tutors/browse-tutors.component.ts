import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-browse-tutors',
  templateUrl: './browse-tutors.component.html',
  styleUrls: ['./browse-tutors.component.less'],
  animations: [appModuleAnimation()],
})
export class BrowseTutorsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
