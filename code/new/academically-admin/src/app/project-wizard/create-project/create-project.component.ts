import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateProjectDto, FileParameter, ProjectAvailabilityDto, ProjectsServiceProxy, Service2Dto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { ServiceWizardService } from '../_services/service-wizard.service';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { DocumentUploaderComponent } from '@app/_shared/components/document-uploader/document-uploader.component';
import { AvailabilitySettingComponent } from './_components/availability-setting/availability-setting.component';

@Component({
  selector: 'app-service-level',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.less'],
  animations: [appModuleAnimation()],
})
export class CreateProjectComponent extends AppComponentBase implements OnInit {
  @ViewChild('documentUploader') documentUploaderComponent: DocumentUploaderComponent;
  @ViewChild('availabilitySetting') availabilitySettingComponent: AvailabilitySettingComponent;

  serviceCategories: Service2Dto[] = [];
  selectedServiceCategories: Service2Dto[] = [];
  model: CreateProjectDto = new CreateProjectDto();
  isLoading = false;
  academicLevels: string[] = [];
  academicLevelQualifications: string[] = [];
  methodologies: string[] = [];
  subjectAreas: string[] = [];
  subjectKeyword: string;
  subjectKeywords: string[] = [];
  urgencyLevels: string[] = [];
  allowedFileExtensions = fileUploadConfiguration.allowedFileExtensions;
  deadline: Date;
  datePickerConfig: BsDatepickerConfig;

  constructor(
    injector: Injector,
    private _router: Router,
    private _servicesService: ServicesServiceProxy,
    private _projectsService: ProjectsServiceProxy,
    private _serviceWizardService: ServiceWizardService
  ) {
    super(injector);
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  get showMethodology(): boolean {
    return ['Graduate', 'Postgraduate', 'Doctorate'].includes(this.model.academicLevel);
  }

  ngOnInit(): void {
    this._serviceWizardService.currentStep$.subscribe(project => {
      this.model = project ?? new CreateProjectDto();
    });

    this.isLoading = true;
    this._servicesService.getStaticServices()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(response => {
        this.serviceCategories = response;

        if (this.serviceCategories && this.serviceCategories.length > 0) {
          const defaultSelection = this.serviceCategories.find(s => s.name.toLocaleLowerCase().trim() === 'academic tutoring');
          if (defaultSelection) {
            this.selectedServiceCategories.push(defaultSelection);
          }
        }
      });

    this.getAcademicLevels();
    this.getMethodologies();
    this.getSubjectAreas();
    this.getUrgencyLevels();

    if (this.documentUploaderComponent) {
      this.documentUploaderComponent.files = [];
    }
  }

  getSelected(id: string): Service2Dto {
    return this.selectedServiceCategories.find(s => s.id === id);
  }

  onCheckChange(checked: boolean, serviceDto: Service2Dto): void {
    const index = this.selectedServiceCategories.findIndex(s => s.id === serviceDto.id);
    if (index > -1 && !checked) {
      this.selectedServiceCategories.splice(index, 1);
    } else if (index === -1 && checked) {
      this.selectedServiceCategories = [serviceDto];
    }
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this.model.deadline = moment(this.deadline).startOf('day');

    const documents = this.documentUploaderComponent.files.map(file => {
      const fileParameter: FileParameter = {
        fileName: file.name,
        data: file,
      };
      return fileParameter;
    });

    this.model.projectAvailabilities = this.availabilitySettingComponent.availabilities?.reduce((arr, curr) =>
    [...arr, ...curr.times.map(t => {
      const availability: ProjectAvailabilityDto = new ProjectAvailabilityDto();
      availability.dayOfWeek = curr.dayOfWeek;
      availability.startTime = moment(t.startTime).format('HH:mm');
      availability.endTime = moment(t.endTime).format('HH:mm');
      return availability;
    })], []) ?? [];

    this._projectsService.create(this.model)
      .pipe(
        switchMap((id) => this._projectsService.uploadProjectDocuments(id, documents)),
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe((project) => {
        this.notify.success(this.l('SavedSuccessfully'));
        this._router.navigate([`/app/projects/${project.id}/browse-tutors`]);
        this._serviceWizardService.clear();
      });
  }

  onBackClick(): void {
    this._router.navigate(['/app/service-wizard/services']);
  }

  onAcademicLevelSelect(academicLevel: string): void {
    this.model.academicLevel = academicLevel;
    this.model.qualification = '';
    if (!this.showMethodology) {
      this.model.methodology = '';
    }
    this.getAcademicLevelQualifications();
  }

  onSearchKeywordKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.addSubjectKeyword();
    }
  }

  onSearchKeywordBlur(): void {
    this.addSubjectKeyword();
  }

  onRemoveSubjectKeywordClick(keyword: string): void {
    const index = this.subjectKeywords.findIndex(e => e === keyword);
    if (index > -1) {
      this.subjectKeywords.splice(index, 1);
      this.updateSubjectKeywords();
    }
  }

  private getAcademicLevels(): void {
    this.academicLevels = [];
    this._projectsService.getAcademicLevels()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        this.academicLevels = responses;
      });
  }

  private getAcademicLevelQualifications(): void {
    this.academicLevelQualifications = [];
    this._projectsService.getAcademicLevelQualifications(this.model.academicLevel)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        this.academicLevelQualifications = responses;
      });
  }

  private getMethodologies(): void {
    this.methodologies = [];
    this._projectsService.getResearchMethods()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        this.methodologies = responses;
      });
  }

  private getSubjectAreas(): void {
    this.subjectAreas = [];
    this._projectsService.getSubjects()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        this.subjectAreas = responses;
      });
  }

  private getUrgencyLevels(): void {
    this.urgencyLevels = [];
    this._projectsService.getUrgencyLevels()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        this.urgencyLevels = responses;
      });
  }

  private addSubjectKeyword(): void {
    if (this.subjectKeyword) {
      const keyword = this.subjectKeyword.toLowerCase();
      const index = this.subjectKeywords.findIndex(e => e.toLowerCase() === keyword);
      if (index < 0) {
        this.subjectKeywords.push(keyword);
        this.updateSubjectKeywords();
      }
    }
    this.subjectKeyword = undefined;
  }

  private updateSubjectKeywords(): void {
    this.model.subjectKeyWords = this.subjectKeywords.join();
  }
}
