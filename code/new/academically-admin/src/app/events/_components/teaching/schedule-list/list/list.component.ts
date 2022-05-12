import { Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { EventDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent extends AppComponentBase implements OnInit {
  @Input() events: EventDto[] = [];

  constructor(injector: Injector, private router: Router) {
    super(injector);
  }

  ngOnInit(): void {
  }

  navToUrl(url: string, id?: string) {
    this.router.navigate([url, id]);
  }
}
