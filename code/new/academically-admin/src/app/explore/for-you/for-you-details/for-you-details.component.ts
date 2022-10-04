import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';

const SUPPORTED_TYPES = ['events', 'users', 'coachings', 'tutorials', 'courses', 'spaces', 'articles'];

@Component({
  selector: 'app-explore-for-you-details',
  templateUrl: './for-you-details.component.html',
  styleUrls: ['./for-you-details.component.less'],
  animations: [appModuleAnimation()],
})
export class ExploreForYouDetailsComponent extends AppComponentBase implements OnInit {

  type: string;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    super(injector);

    this._route.paramMap.subscribe(paramMap => {
      if (paramMap.has('type')) {
        this.type = paramMap.get('type');
        if (!SUPPORTED_TYPES.includes(this.type)) this._router.navigate([''], { relativeTo: this._route.parent });
      }
    });
  }

  ngOnInit(): void {
  }
}
