import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { EventDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-created',
  templateUrl: './created.component.html',
  styleUrls: ['./created.component.less']
})
export class CreatedComponent extends AppComponentBase implements OnInit {
  events: EventDto[] = Array(Math.floor(Math.random() * (10 - 4) + 4)).fill([]).map(() => this.generateRandomEvent()) as EventDto[];
  isLoading = true;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
    console.log(this.events);
  }
}
