import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.less']
})
export class LearnComponent extends AppComponentBase implements OnInit {
  id: string;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
  ) {
    super(injector);
    this._route.parent.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('course-id')) {
        this.id = paramMap.get('course-id');
      }
    });
  }

  ngOnInit(): void {
  }

}
