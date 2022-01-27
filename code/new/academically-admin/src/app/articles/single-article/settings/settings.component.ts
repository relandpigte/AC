import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CommentSetting, ArticleType, ArticlesServiceProxy, UpdateArticleSettingsDto, DelayType } from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { ArticleService } from '@app/articles/_services/article.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as _ from 'lodash';

enum EditField {
  Comments = 1,
  Url = 2,
  Visibility = 3,
  Delay = 4,
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent extends AppComponentBase implements OnInit {
  model = new UpdateArticleSettingsDto();
  CommentSetting = CommentSetting;
  isLoading = false;
  EditField = EditField;
  ArticleType = ArticleType;
  DelayType = DelayType;
  hasParent = false;

  editField: EditField;
  articleType: ArticleType;
  lastArticleValue: string;
  specificDateValue: Date;
  datePickerConfig: BsDatepickerConfig;

  constructor(
    injector: Injector,
    private _router: Router,
    private _articlesService: ArticlesServiceProxy,
    private _articleService: ArticleService,
  ) {
    super(injector);
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
    this.datePickerConfig.minDate = new Date();
    this._articleService.articleCreated$.subscribe(article => {
      if (article) {
        this.model.init(article);
        this.articleType = article.type;
        this.hasParent = !_.isNil(article.parentId);

        switch (this.model.delayType) {
          case DelayType.SpecificDate:
            if (this.model.delayValue && this.model.delayValue.trim()) {
              const dateParts = this.model.delayValue.split('/');
              const day = +dateParts[0];
              const month = +dateParts[1] - 1;
              const year = +dateParts[2];
              this.specificDateValue = new Date(year, month, day);
            }
            break;
          default:
            this.lastArticleValue = this.model.delayValue;
            break;
        }
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

    switch (this.model.delayType) {
      case DelayType.SpecificDate:
        if (this.specificDateValue) {
          const dateParts = [
            this.specificDateValue.getDate(),
            this.specificDateValue.getMonth() + 1,
            this.specificDateValue.getFullYear(),
          ];
          this.model.delayValue = dateParts.join('/');
        }
        break;
      default:
        this.model.delayValue = this.lastArticleValue;
        break;
    }

    this._articlesService.updateSettings(this.model)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        this.notify.success(this.l('SavedSuccessfully'));
        this._articleService.articleCreated = response;
        setTimeout(() => {
          this.editField = undefined;
        });
      });
  }

  onEditClick(editField: EditField): void {
    this.editField = editField;
  }

  onCommentSettingChange(): void {
    if (this.model.commentSetting !== CommentSetting.Visible) {
      this.model.commentModeration = false;
    }
  }

  onDripTypeChange(): void {
    this.lastArticleValue = undefined;
    this.specificDateValue = undefined;
  }
}

