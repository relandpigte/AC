import { Component, OnInit } from '@angular/core';
import { Injector } from '@node_modules/@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-related-events-badge',
  templateUrl: './related-events-badge.component.html',
  styleUrls: ['./related-events-badge.component.less']
})
export class RelatedEventsBadgeComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector
  ) {
    super(injector);
  }
  ngOnInit(): void {
  }

}
