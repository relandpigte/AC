import { Injectable } from '@angular/core';
import { CourseDto } from '@shared/service-proxies/service-proxies';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  public course$: Observable<CourseDto>;

  private _courseSubject: BehaviorSubject<CourseDto>;

  constructor() {
    this._courseSubject = new BehaviorSubject<CourseDto>(new CourseDto());
    this.course$ = this._courseSubject.asObservable();
  }

  public set course(value: CourseDto) {
    this._courseSubject.next(value);
  }
}
