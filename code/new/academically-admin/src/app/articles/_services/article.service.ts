import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ArticleDto, CommentSetting } from '@shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  public articleCreated$: Observable<ArticleDto>;
  public articleSave$: Observable<boolean>;
  public articleCommentSetting$: Observable<CommentSetting>;

  private _articleCreatedSubject: BehaviorSubject<ArticleDto>;
  private _articleSaveSubject: BehaviorSubject<boolean>;
  private _articleCommentSettingSubject: BehaviorSubject<CommentSetting>;

  constructor() {
    this._articleCreatedSubject = new BehaviorSubject<ArticleDto>(undefined);
    this.articleCreated$ = this._articleCreatedSubject.asObservable();

    this._articleSaveSubject = new BehaviorSubject<boolean>(false);
    this.articleSave$ = this._articleSaveSubject.asObservable();

    this._articleCommentSettingSubject = new BehaviorSubject<CommentSetting>(undefined);
    this.articleCommentSetting$ = this._articleCommentSettingSubject.asObservable();
  }

  public set articleCreated(value: ArticleDto) {
    this._articleCreatedSubject.next(value);
  }

  public set articleSave(value: boolean) {
    this._articleSaveSubject.next(value);
  }

  public set articleCommentSetting(value: CommentSetting) {
    this._articleCommentSettingSubject.next(value);
  }
}
