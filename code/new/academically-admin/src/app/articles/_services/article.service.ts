import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ArticleDto } from '@shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  public articleCreated$: Observable<ArticleDto>;
  public articleSave$: Observable<boolean>;

  private _articleCreatedSubject: BehaviorSubject<ArticleDto>;
  private _articleSaveSubject: BehaviorSubject<boolean>;

  constructor() {
    this._articleCreatedSubject = new BehaviorSubject<ArticleDto>(undefined);
    this.articleCreated$ = this._articleCreatedSubject.asObservable();

    this._articleSaveSubject = new BehaviorSubject<boolean>(false);
    this.articleSave$ = this._articleSaveSubject.asObservable();
  }

  public set articleCreated(value: ArticleDto) {
    this._articleCreatedSubject.next(value);
  }

  public set articleSave(value: boolean) {
    this._articleSaveSubject.next(value);
  }
}
