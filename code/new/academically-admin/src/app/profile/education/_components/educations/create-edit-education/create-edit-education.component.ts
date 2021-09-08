import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { DocumentUploaderComponent } from '@app/_shared/components/document-uploader/document-uploader.component';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { countries } from '@shared/constants/countries';
import {
  FileParameter,
  UniversitiesServiceProxy,
  UniversityDto,
  UserEducationDto,
  UserEducationsServiceProxy,
  CreateEditUserEducationDto,
  CreateEditUserEducationCourseDto,
} from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Observer } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { CoursesComponent } from '../courses/courses.component';

@Component({
  selector: 'app-create-edit-education',
  templateUrl: './create-edit-education.component.html',
  styleUrls: ['./create-edit-education.component.less']
})
export class CreateEditEducationComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild('documentUploader') documentUploaderComponent: DocumentUploaderComponent;
  public model: UserEducationDto = new UserEducationDto();

  @Output() userEducationSaved = new EventEmitter<boolean>();
  @ViewChild(CoursesComponent) coursesComponent: CoursesComponent;

  countries = countries;
  isLoading = false;
  qualificationExtensions = fileUploadConfiguration.allowedQualificationExtensions;
  countryCode: string;
  universitiesTypeaheadSource: Observable<UniversityDto[]>;
  yearSelections: string[] = [];
  currentYear: number;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _universitiesService: UniversitiesServiceProxy,
    private _userEducationsService: UserEducationsServiceProxy,
  ) {
    super(injector);
    this.currentYear = this.convertToUserDate(new Date()).getFullYear();
    this.yearSelections.push('Present');
    for (let year = this.currentYear; year >= 1900; year--) {
      const sYear = year.toString();
      this.yearSelections.push(sYear);
    }
  }

  ngOnInit(): void {
    this.getUniversities();
    if (!this.model) {
      this.model = new UserEducationDto();
    }
  }

  ngAfterViewInit(): void {
    if (this.model && this.model.id) {
      this.coursesComponent.userEducationCourses = this.model.userEducationCourses;
      this.countryCode = this.model.universityCountryCode;
    }
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this.model.universityCountryCode = this.countryCode;
    this.model.userEducationCourses = this.coursesComponent.userEducationCourses;

    const request = new CreateEditUserEducationDto();
    request.id = this.model.id;
    request.userId = this.model.userId;
    request.city = this.model.city;
    request.startYear = this.model.startYear;
    request.endYear = this.model.endYear;
    request.universityName = this.model.universityName;
    request.universityCountryCode = this.model.universityCountryCode;
    request.userEducationCourses = this.coursesComponent.userEducationCourses.map(courseModel => {
      const courseRequest = new CreateEditUserEducationCourseDto();
      courseRequest.id = courseModel.id;
      courseRequest.title = courseModel.title;
      courseRequest.grade = courseModel.grade;
      courseRequest.academicLevelId = courseModel.academicLevelId;
      courseRequest.academicLevelQualificationId = courseModel.academicLevelQualificationId;
      return courseRequest;
    });

    const saveSubscription = request.id
      ? this._userEducationsService.update(request)
      : this._userEducationsService.create(request);
    saveSubscription.subscribe(userEducationId => {
      const documentsToUpload = this.documentUploaderComponent.files.map(file => {
        const fileParameter: FileParameter = {
          fileName: file.name,
          data: file,
        };
        return fileParameter;
      });
      const categories = JSON.stringify(this.documentUploaderComponent.categories);
      this._userEducationsService.uploadDocuments(userEducationId, categories, documentsToUpload)
        .pipe(finalize(() => {
          this.isLoading = false;
        }))
        .subscribe(() => {
          this.notify.success(this.l('SavedSuccessfully'));
          this.userEducationSaved.emit(true);
          this._modal.hide();
        });
    });
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onStartYearChange(): void {
    const startYear = this.getYear(this.model.startYear);
    const endYear = this.getYear(this.model.endYear);
    if (startYear > endYear) {
      const sStartYear = startYear === this.currentYear + 1 ? 'Present' : startYear.toString();
      this.model.endYear = sStartYear;
    }
  }

  onEndYearChange(): void {
    const endYear = this.getYear(this.model.endYear);
    const startYear = this.getYear(this.model.startYear);
    if (endYear < startYear) {
      const sEndYear = endYear === this.currentYear + 1 ? 'Present' : endYear.toString();
      this.model.startYear = sEndYear;
    }
  }

  getYear(year: string): number {
    return year === 'Present' ? this.currentYear + 1 : +year;
  }

  private getUniversities(): void {
    this.universitiesTypeaheadSource = new Observable((observer: Observer<string>) => {
      observer.next(this.model.universityName);
    }).pipe(
      switchMap((query: string) => {
        return this._universitiesService.search(this.countryCode, query);
      })
    );
  }
}
