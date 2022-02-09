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
  public previewOnly$: Observable<boolean>;
  public singlePageOnly$: Observable<boolean>;

  private contentSubject: BehaviorSubject<Content>;
  private navigateUpSubject: BehaviorSubject<Content>;
  private removeSubject: BehaviorSubject<Content>;
  private previewOnlySubject: BehaviorSubject<boolean>;
  private singlePageOnlySubject: BehaviorSubject<boolean>;

  constructor() {
    this.contentSubject = new BehaviorSubject<Content>(undefined);
    this.content$ = this.contentSubject.asObservable();

    this.navigateUpSubject = new BehaviorSubject<Content>(undefined);
    this.navigateUp$ = this.navigateUpSubject.asObservable();

    this.removeSubject = new BehaviorSubject<Content>(undefined);
    this.remove$ = this.removeSubject.asObservable();

    this.previewOnlySubject = new BehaviorSubject<boolean>(false);
    this.previewOnly$ = this.previewOnlySubject.asObservable();

    this.singlePageOnlySubject = new BehaviorSubject<boolean>(false);
    this.singlePageOnly$ = this.singlePageOnlySubject.asObservable();
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

  public set previewOnly(value: boolean) {
    this.previewOnlySubject.next(value);
  }

  public set singlePageOnly(value: boolean) {
    this.singlePageOnlySubject.next(value);
  }
}
