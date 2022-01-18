import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CommentSetting, ArticleType, ArticlesServiceProxy, UpdateArticleSettingsDto } from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { ArticleService } from '@app/articles/_services/article.service';
import { takeUntil, finalize } from 'rxjs/operators';

enum EditField {
  Comments = 1,
  Url = 2,
  Visibility = 3,
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent extends AppComponentBase implements OnInit {
  model: UpdateArticleSettingsDto = new UpdateArticleSettingsDto();
  CommentSetting = CommentSetting;
  isLoading = false;
  editField: EditField;
  articleType: ArticleType;
  EditField = EditField;
  ArticleType = ArticleType;

  constructor(
    injector: Injector,
    private _router: Router,
    private _articlesService: ArticlesServiceProxy,
    private _articleService: ArticleService,
  ) {
    super(injector);
    this._articleService.articleCreated$.subscribe(article => {
      if (article) {
        this.model.init(article);
        this.articleType = article.type;
      }
    });
  }

  ngOnInit(): void {
  }

  onBackClick(): void {
    this._router.navigate(['/app/articles/' + this.model.id + '/details']);
  }

  onFormSubmit(): void {
    this.isLoading = true;

    this._articlesService.updateSettings(this.model)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        setTimeout(() => {
          this.editField = undefined;
        });
      });
  }

  onEditClick(editField: EditField): void {
    this.editField = editField;
  }
}

