import { Injectable } from '@angular/core';
import { CourseSectionDto, CourseDto, CourseSectionPageDto } from '@shared/service-proxies/service-proxies';
import { Observable, BehaviorSubject } from 'rxjs';
import { Content } from '../_models/content';

@Injectable({
  providedIn: 'root'
})
export class PageBuilderService {
  public courseSection$: Observable<CourseSectionDto>;
  public content$: Observable<Content>;
  public courseSectionPage$: Observable<CourseSectionPageDto>;


  private courseSectionSubject: BehaviorSubject<CourseSectionDto>;
  private contentSubject: BehaviorSubject<Content>;
  private courseSectionPageSubject: BehaviorSubject<CourseSectionPageDto>;


  constructor() {
    const courseSectionDefaultValue = new CourseSectionDto();
    courseSectionDefaultValue.course = new CourseDto();
    this.courseSectionSubject = new BehaviorSubject<CourseSectionDto>(courseSectionDefaultValue);
    this.courseSection$ = this.courseSectionSubject.asObservable();
    this.contentSubject = new BehaviorSubject<Content>(undefined);
    this.content$ = this.contentSubject.asObservable();
    const courseSectionPageDefaultValue = new CourseSectionPageDto();
    this.courseSectionPageSubject = new BehaviorSubject<CourseSectionPageDto>(courseSectionPageDefaultValue);
    this.courseSectionPage$ = this.courseSectionPageSubject.asObservable();
  }

  public set courseSection(value: CourseSectionDto) {
    this.courseSectionSubject.next(value);
  }

  public set content(value: Content) {
    this.contentSubject.next(value);
  }

  public set courseSectionPage(value: CourseSectionPageDto) {
    this.courseSectionPageSubject.next(value);
  }
}
