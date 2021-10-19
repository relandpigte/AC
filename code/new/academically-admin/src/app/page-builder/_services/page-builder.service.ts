import { Injectable } from '@angular/core';
import { CourseSectionDto, CourseDto } from '@shared/service-proxies/service-proxies';
import { Observable, BehaviorSubject } from 'rxjs';
import { PageContent } from '../_models/page-content';

@Injectable({
  providedIn: 'root'
})
export class PageBuilderService {
  public courseSection$: Observable<CourseSectionDto>;
  public pageContent$: Observable<PageContent>;

  private courseSectionSubject: BehaviorSubject<CourseSectionDto>;
  private pageContentSubject: BehaviorSubject<PageContent>;

  constructor() {
    const courseSectionDefaultValue = new CourseSectionDto();
    courseSectionDefaultValue.course = new CourseDto();
    this.courseSectionSubject = new BehaviorSubject<CourseSectionDto>(courseSectionDefaultValue);
    this.courseSection$ = this.courseSectionSubject.asObservable();
    this.pageContentSubject = new BehaviorSubject<PageContent>(new PageContent());
    this.pageContent$ = this.pageContentSubject.asObservable();
  }

  public set courseSection(value: CourseSectionDto) {
    this.courseSectionSubject.next(value);
  }

  public set pageContent(value: PageContent) {
    this.pageContentSubject.next(value);
  }
}
