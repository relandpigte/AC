import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Content } from '../_models/content';

@Injectable({
  providedIn: 'root'
})
export class PageBuilderService {
  public content$: Observable<Content>;
  public navigateUp$: Observable<Content>;

  private contentSubject: BehaviorSubject<Content>;
  private navigateUpSubject: BehaviorSubject<Content>;

  constructor() {
    this.contentSubject = new BehaviorSubject<Content>(undefined);
    this.content$ = this.contentSubject.asObservable();

    this.navigateUpSubject = new BehaviorSubject<Content>(undefined);
    this.navigateUp$ = this.navigateUpSubject.asObservable();
  }

  public set content(value: Content) {
    this.contentSubject.next(value);
  }

  public set nagivateUp(value: Content) {
    this.navigateUpSubject.next(value);
  }
}
