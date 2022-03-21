import { Component, OnInit, Injector } from '@angular/core';
import { CommentSetting, ArticleType, ArticlesServiceProxy, UpdateArticleSettingsDto, DelayType } from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { ArticleService } from '@app/articles/_services/article.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as _ from 'lodash';
import { AutoSaveComponentBase } from '@shared/auto-save-component-base';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent extends AutoSaveComponentBase implements OnInit {
  id: string;
  model = new UpdateArticleSettingsDto();
  CommentSetting = CommentSetting;
  isLoading = false;
  ArticleType = ArticleType;
  DelayType = DelayType;
  hasParent = false;

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
  }

  ngOnInit(): void {
    this._articleService.articleCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id && this.id !== response.id) {
          this.id = response.id;
          this.getArticle();
        }
      });
  }

  onBackClick(): void {
    this._router.navigate(['/app/articles/' + this.model.id + '/details']);
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

  onSpecificDateChange(): void {
    if (this.specificDateValue) {
      const dateParts = [
        this.specificDateValue.getDate(),
        this.specificDateValue.getMonth() + 1,
        this.specificDateValue.getFullYear(),
      ];
      this.model.delayValue = dateParts.join('/');
    }
  }

  private updateSettings(): void {
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
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        // do nothing
      });
  }

  private getArticle(): void {
    this.isLoading = true;
    this._articlesService.get(this.id)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        this.model.init(response);
        this.articleType = response.type;
        this.hasParent = !_.isNil(response.parentId);

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
        this.modelToSave = this.model;
        this.initAutoSave(this.updateSettings);
      });
  }
}

