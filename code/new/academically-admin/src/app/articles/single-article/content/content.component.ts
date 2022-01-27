import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '@app/articles/_services/article.service';
import { ContentBuilderComponent } from '@app/content-builder/content-builder.component';
import { AppComponentBase } from '@shared/app-component-base';
import { ContentsServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less']
})
export class ContentComponent extends AppComponentBase implements OnInit {
  id: string;
  @ViewChild('contentBuilder') contentBuilder: ContentBuilderComponent;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _contentsService: ContentsServiceProxy,
    private _articleService: ArticleService,
  ) {
    super(injector);
    this._articleService.articleCreated$.subscribe(article => {
      if (article) {
        this.id = article.id;
        this.getContent();
      }
    });
    this._articleService.articleSave$.subscribe(response => {
      if (response && this.contentBuilder) {
        const content = this.contentBuilder.prepareContentsForSaving(this.id);
        this._contentsService.save(content)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.notify.success(this.l('SavedSuccessfully'));
          });
      }
    });
  }

  ngOnInit(): void {
  }

  private getContent(): void {
    this._contentsService.get(this.id)
      .subscribe(response => {
        this.contentBuilder.pageContent = response;
        this.contentBuilder.initializeContentManager();
      });
  }
}
