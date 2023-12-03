import { Injectable } from '@angular/core';
import { ArticleDto, GetStudentArticleDto } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreviewService {
  public article$: Observable<ArticleDto>;
  public preview$: Observable<boolean>;
  public studentArticle$: Observable<GetStudentArticleDto>;

  private _articleSubject: BehaviorSubject<ArticleDto>;
  private _previewSubject: BehaviorSubject<boolean>;
  private _studentArticleSubject: BehaviorSubject<GetStudentArticleDto>;

  constructor() {
    this._articleSubject = new BehaviorSubject<ArticleDto>(new ArticleDto());
    this.article$ = this._articleSubject.asObservable();

    this._previewSubject = new BehaviorSubject<boolean>(true);
    this.preview$ = this._previewSubject.asObservable();

    this._studentArticleSubject = new BehaviorSubject<GetStudentArticleDto>(undefined);
    this.studentArticle$ = this._studentArticleSubject.asObservable();
  }

  public set article(value: ArticleDto) {
    this._articleSubject.next(value);
  }

  public set preview(value: boolean) {
    this._previewSubject.next(value);
  }

  public set studentArticle(value: GetStudentArticleDto) {
    this._studentArticleSubject.next(value);
  }
}
