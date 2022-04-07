import { Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { EventType, StudentEventDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.less']
})
export class GridComponent extends AppComponentBase implements OnInit {

  @Input() models: StudentEventDto[] = [];
  EventType = EventType;
  constructor(injector: Injector , private router: Router) {
    super(injector);
   }

  ngOnInit(): void {
  }

  navToUrl(url , id) {
    this.router.navigate([url , id]);
  }


}
