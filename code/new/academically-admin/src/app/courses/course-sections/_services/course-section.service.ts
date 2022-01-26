import { Injectable } from '@angular/core';
import { CourseSectionDto } from '@shared/service-proxies/service-proxies';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseSectionService {
  public courseSectionCreated$: Observable<CourseSectionDto>;
  public courseSectionSave$: Observable<boolean>;

  private _courseSectionCreatedSubject: BehaviorSubject<CourseSectionDto>;
  private _courseSectionSaveSubject: BehaviorSubject<boolean>;

  constructor() {
    this._courseSectionCreatedSubject = new BehaviorSubject<CourseSectionDto>(undefined);
    this.courseSectionCreated$ = this._courseSectionCreatedSubject.asObservable();

    this._courseSectionSaveSubject = new BehaviorSubject<boolean>(false);
    this.courseSectionSave$ = this._courseSectionSaveSubject.asObservable();
  }

  public set courseSectionCreated(value: CourseSectionDto) {
    this._courseSectionCreatedSubject.next(value);
  }

  public set courseSectionSave(value: boolean) {
    this._courseSectionSaveSubject.next(value);
  }
}
