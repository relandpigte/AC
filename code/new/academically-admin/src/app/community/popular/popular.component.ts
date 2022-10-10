import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-popular',
  templateUrl: './popular.component.html',
  styleUrls: ['./popular.component.less']
})
export class PopularComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
  ) { 
    super(injector);
  }

  ngOnInit(): void {
  }

}
