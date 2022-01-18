import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ArticleDto } from '@shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  public articleCreated$: Observable<ArticleDto>;
  private _articleCreatedSubject: BehaviorSubject<ArticleDto>;

  constructor() {
    this._articleCreatedSubject = new BehaviorSubject<ArticleDto>(undefined);
    this.articleCreated$ = this._articleCreatedSubject.asObservable();
  }

  public set articleCreated(value: ArticleDto) {
    this._articleCreatedSubject.next(value);
  }
}
