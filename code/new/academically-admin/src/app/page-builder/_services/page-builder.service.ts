import { Injectable } from '@angular/core';
import { CourseSectionDto, CourseDto } from '@shared/service-proxies/service-proxies';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageBuilderService {
  public courseSection$: Observable<CourseSectionDto>;

  private courseSectionSubject: BehaviorSubject<CourseSectionDto>;

  constructor() {
    const courseSectionDefaultValue = new CourseSectionDto();
    courseSectionDefaultValue.course = new CourseDto();
    this.courseSectionSubject = new BehaviorSubject<CourseSectionDto>(courseSectionDefaultValue);
    this.courseSection$ = this.courseSectionSubject.asObservable();
  }

  public set courseSection(value: CourseSectionDto) {
    this.courseSectionSubject.next(value);
  }
}
