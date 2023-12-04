import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  ArticleDto,
  ArticleType,
  GetStudentArticleDto,
  PricingType,
  ReactionType,
  ReactionsServiceProxy,
  StudentArticleDto,
  StudentArticlesServiceProxy,
  UserFollowerDto,
  UserFollowersServiceProxy
} from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { PreviewService } from '../../_services/preview.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent extends AppComponentBase implements OnInit {
  model = new ArticleDto();
  studentArticle = new GetStudentArticleDto();
  parentStudentArticle = new GetStudentArticleDto();
  preview = true;
  likeCount = 0;
  isLiked = false;
  userFollower: UserFollowerDto;

  ArticleType = ArticleType;
  PricingType = PricingType;

  constructor(
    injector: Injector,
    private _previewService: PreviewService,
    private _studentArticlesService: StudentArticlesServiceProxy,
    private _reactionsService: ReactionsServiceProxy,
    private _userFollowersService: UserFollowersServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._previewService.article$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id) {
          this.model = response;
          this.getUserFollower();
          this.getStudentArticle();
          this.getLike();
          this.getLikeCount();
          if (this.model && this.model.parentId) {
            this.getParentStudentArticle();
          }
        }
      });
    this._previewService.preview$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.preview = response;
      });
  }

  onSaveClick(): void {
    const newStudentArticle = new StudentArticleDto();
    newStudentArticle.articleId = this.model.id;
    newStudentArticle.saveOnly = true;
    this._studentArticlesService.create(newStudentArticle)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.getStudentArticle();
      });
  }

  onUnsaveClick(): void {
    this._studentArticlesService.delete(this.studentArticle.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.notify.success(this.l('UnsavedSuccessfully'));
        this.getStudentArticle();
      });
  }

  onLikeClick(): void {
    this._reactionsService.save(this.model.id, ReactionType.Like)
      .subscribe(() => {
        if (this.isLiked) {
          this.isLiked = false;
          this.likeCount--;
        } else {
          this.isLiked = true;
          this.likeCount++;
        }
      });
  }

  onFollowClick(): void {
    this._userFollowersService.create(this.model.creatorUser.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.userFollower = response;
        this.notify.success(this.l('YouAreNowFollowingThisUser'));
      });
  }

  onUnfollowClick(): void {
    this._userFollowersService.delete(this.userFollower.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.userFollower = undefined;
        this.notify.success(this.l('YouUnfollowedThisUser'));
      });
  }

  onPurchaseClick(article: ArticleDto): void {
    const confirmationMessageLocale = article.type === ArticleType.SingleArticle ? 'Generics.Purchase.Single.ConfirmationMessage' : 'Generics.Purchase.Series.ConfirmationMessage';
    this.message.confirm(this.l(confirmationMessageLocale, ['article']), undefined,
      (result => {
        if (result) {
          const studentArticle = new StudentArticleDto();
          studentArticle.articleId = article.id;
          studentArticle.saveOnly = false;
          this._studentArticlesService.create(studentArticle)
            .pipe(
              takeUntil(this.destroyed$),
            )
            .subscribe(response => {
              this._previewService.studentArticle = response;
              if (response.articleId === this.model.id) {
                this.studentArticle = response;
              } else {
                this.parentStudentArticle = response;
                this.getStudentArticle();
              }
              const messageLocale = article.type === ArticleType.SingleArticle ? 'Generics.Purchase.Single.SuccessMessage' : 'Generics.Purchase.Series.SuccessMessage';
              this.notify.success(this.l(messageLocale, ['article']));
            });
        }
      }));
  }

  private getStudentArticle(): void {
    this._studentArticlesService.getByArticle(this.model.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.studentArticle = response;
      });
  }

  private getParentStudentArticle(): void {
    this._studentArticlesService.getByArticle(this.model.parentId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.parentStudentArticle = response;
      });
  }

  private getLike(): void {
    this._reactionsService.get(this.model.id, ReactionType.Like)
      .subscribe(response => {
        this.isLiked = !_.isEmpty(response);
      });
  }

  private getLikeCount(): void {
    this._reactionsService.getCount(this.model.id, ReactionType.Like)
      .subscribe(response => {
        this.likeCount = response;
      });
  }

  private getUserFollower(): void {
    this._userFollowersService.get(this.model.creatorUser.id, this.appSession.userId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.userFollower = response;
      });
  }
}
