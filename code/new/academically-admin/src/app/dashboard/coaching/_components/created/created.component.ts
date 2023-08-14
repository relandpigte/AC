import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CoachingDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-created',
  templateUrl: './created.component.html',
  styleUrls: ['./created.component.less']
})
export class CreatedComponent extends AppComponentBase implements OnInit {
  coachings: CoachingDto[] = Array(Math.floor(Math.random() * (10 - 4) + 4)).fill([]).map(() => this.generateRandomCoaching()) as CoachingDto[];
  isLoading = true;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
    console.log(this.coachings);
  }
}
