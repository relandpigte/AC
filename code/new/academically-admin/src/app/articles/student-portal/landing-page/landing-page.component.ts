import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentArticlesServiceProxy, StudentArticleDto } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less']
})
export class LandingPageComponent extends AppComponentBase implements OnInit {
  id: string;
  isLoading = false;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _router: Router,
    private _studentArticlesService: StudentArticlesServiceProxy,
  ) {
    super(injector);
    this._route.parent.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('article-id')) {
        this.id = paramMap.get('article-id');
      }
    });
  }

  ngOnInit(): void {
  }

  onBuyNowClick(): void {
    const studentArticle = new StudentArticleDto();
    studentArticle.articleId = this.id;
    studentArticle.saveOnly = false;
    this._studentArticlesService.create(studentArticle)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this._router.navigate([`/app/articles/student-portal/${this.id}/portal`]);
      });
  }
}
