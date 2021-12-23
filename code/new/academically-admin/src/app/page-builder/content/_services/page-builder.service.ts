import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Content } from '../_models/content';

@Injectable({
  providedIn: 'root'
})
export class PageBuilderService {
  public content$: Observable<Content>;
  public navigateUp$: Observable<Content>;
  public remove$: Observable<Content>;

  private contentSubject: BehaviorSubject<Content>;
  private navigateUpSubject: BehaviorSubject<Content>;
  private removeSubject: BehaviorSubject<Content>;

  constructor() {
    this.contentSubject = new BehaviorSubject<Content>(undefined);
    this.content$ = this.contentSubject.asObservable();

    this.navigateUpSubject = new BehaviorSubject<Content>(undefined);
    this.navigateUp$ = this.navigateUpSubject.asObservable();

    this.removeSubject = new BehaviorSubject<Content>(undefined);
    this.remove$ = this.removeSubject.asObservable();
  }

  public set content(value: Content) {
    this.contentSubject.next(value);
  }

  public set nagivateUp(value: Content) {
    this.navigateUpSubject.next(value);
  }

  public set remove(value: Content) {
    this.removeSubject.next(value);
  }
}
