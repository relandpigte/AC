import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import * as moment from 'moment';

@Component({
  templateUrl: './app.component.html',
})
export class AppComponent extends AppComponentBase implements OnInit {
  constructor(injector: Injector) {
    super(injector);
    moment.fn.toISOString = function() {
      return this.format('YYYY-MM-DD HH:mm:ss');
    };
  }

  ngOnInit(): void {}
}
