import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-attendees',
  templateUrl: './attendees.component.html',
  styleUrls: ['./attendees.component.less']
})
export class AttendeesComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
