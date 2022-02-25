import { Injectable } from '@angular/core';
import { ArticleDto, VideoDto } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TutorPortalService {
  public article$: Observable<ArticleDto>;

  private _articleSubject: BehaviorSubject<ArticleDto>;

  constructor() {
    this._articleSubject = new BehaviorSubject<ArticleDto>(new ArticleDto());
    this.article$ = this._articleSubject.asObservable();
  }

  public set article(value: ArticleDto) {
    this._articleSubject.next(value);
  }
}
