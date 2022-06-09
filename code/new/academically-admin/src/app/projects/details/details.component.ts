import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Availability } from '@app/project-wizard/create-project/_models/availability';
import { DocumentUploaderComponent } from '@app/_shared/components/document-uploader/document-uploader.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { FileParameter, ProjectAvailabilityDto, ProjectDto, ProjectsServiceProxy, Service2Dto, ServicesServiceProxy, UpdateProjectDto } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { forkJoin, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { ProjectService } from '../_services/project.service';
import { DateTimeHelper } from '@shared/helpers/DateTimeHelper';
import { AvailabilitySettingComponent } from './_components/availability-setting/availability-setting.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less'],
  animations: [appModuleAnimation()],
})
export class DetailsComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild("projectNameEl") projectNameInput: ElementRef;
  @ViewChild('documentUploader') documentUploaderComponent: DocumentUploaderComponent;
  @ViewChild('availabilitySetting') availabilitySettingComponent: AvailabilitySettingComponent;

  projectId: string;
  project: ProjectDto;

  serviceCategories: Service2Dto[] = [];
  selectedServiceCategories: Service2Dto[] = [];
  academicLevels: string[] = [];
  academicLevelQualifications: string[] = [];
  methodologies: string[] = [];
  subjectAreas: string[] = [];
  urgencyLevels: string[] = [];

  subjectKeyWordValue: string;
  academicLevelValue: string;
  qualificationValue: string;
  methodologyValue: string;
  subjectAreaValue: string;
  urgencyLevelValue: string;

  allowedFileExtensions = fileUploadConfiguration.allowedFileExtensions;

  datePickerConfig: BsDatepickerConfig;

  hasFilesToUpload = false;
  isEditing = false;
  isSaving = false;
  isFetchingFiles = false;
  isLoading = false;

  projectForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }, [Validators.required]),
    name: new FormControl({ value: null, disabled: true }, [Validators.required]),
    description: new FormControl({ value: null, disabled: true }, [Validators.required]),
    academicLevel: new FormControl({ value: null, disabled: true }, [Validators.required]),
    qualification: new FormControl({ value: null, disabled: true }, [Validators.required]),
    methodology: new FormControl({ value: null, disabled: true }, []),
    subjectArea: new FormControl({ value: null, disabled: true }, [Validators.required]),
    subjectKeyWords: new FormControl({ value: null, disabled: true }, [Validators.required]),
    urgencyLevel: new FormControl({ value: null, disabled: true }, [Validators.required]),
    deadline: new FormControl({ value: null, disabled: true }, []),
    isPrivateRequest: new FormControl({ value: null, disabled: true }, [])
  });

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _router: Router,
    private _projectService: ProjectService,
    private _servicesService: ServicesServiceProxy,
    private _projectsService: ProjectsServiceProxy
  ) {
    super(injector);
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  get showLoader(): boolean { return this.isLoading || this.isFetchingFiles; }
  get showMethodology(): boolean { return ['Graduate', 'Postgraduate', 'Doctorate'].includes(this.academicLevel?.value); }
  get name(): AbstractControl { return this.projectForm.get('name'); }
  get description(): AbstractControl { return this.projectForm.get('description'); }
  get academicLevel(): AbstractControl { return this.projectForm.get('academicLevel'); }
  get qualification(): AbstractControl { return this.projectForm.get('qualification'); }
  get methodology(): AbstractControl { return this.projectForm.get('methodology'); }
  get subjectArea(): AbstractControl { return this.projectForm.get('subjectArea'); }
  get subjectKeyWords(): AbstractControl { return this.projectForm.get('subjectKeyWords'); }
  get urgencyLevel(): AbstractControl { return this.projectForm.get('urgencyLevel'); }
  get deadline(): AbstractControl { return this.projectForm.get('deadline'); }
  get isPrivateRequest(): AbstractControl { return this.projectForm.get('isPrivateRequest'); }
  get subjectKeyWordsList(): string[] { return this.subjectKeyWords?.value?.split(',') ?? []; }

  ngOnInit(): void {
    this.isLoading = true;
    this._route.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('project-id')) {
        this.projectId = paramMap.get('project-id');
        this.init();
      }
    });
  }

  ngAfterViewInit(): void {
    this.listenToChanges();
  }

  private listenToChanges(): void {
    const formSubmission = () => this.isEditing && !this.projectForm.pristine && this.projectForm.valid && this.onFormSubmit();

    this.projectForm.valueChanges
    .pipe(debounceTime(2000), distinctUntilChanged(), takeUntil(this.destroyed$))
    .subscribe(() => formSubmission());

    this.documentUploaderComponent.filesChanged
    .pipe(debounceTime(2000), distinctUntilChanged(), takeUntil(this.destroyed$))
    .subscribe(() => {
      this.hasFilesToUpload = true;
      this.projectForm.markAsDirty();
      formSubmission();
    });

    this.availabilitySettingComponent.availabilityChanged
    .pipe(debounceTime(2000), distinctUntilChanged(), takeUntil(this.destroyed$))
    .subscribe(() => {
      this.projectForm.markAsDirty();
      formSubmission();
    });
  }

  private init(): void {
    this._projectsService.get(this.projectId)
    .pipe(switchMap(project => {
      this.project = project;
      return forkJoin([
        this._servicesService.getStaticServices(),
        this._projectsService.getAcademicLevels(),
        this._projectsService.getResearchMethods(),
        this._projectsService.getSubjects(),
        this._projectsService.getUrgencyLevels(),
        this._projectsService.getAcademicLevelQualifications(project?.academicLevel)
      ])
    }))
    .pipe(finalize(() => this.isLoading = false))
    .pipe(takeUntil(this.destroyed$))
    .subscribe(res => {
      this.initStaticServices(res[0]);
      this.academicLevels = res[1];
      this.methodologies = res[2];
      this.subjectAreas = res[3];
      this.urgencyLevels = res[4];
      this.academicLevelQualifications = res[5];
      this.initForm();
      this.initDocuments();
      this.initAvailabilities();
    });
  }

  private initForm(): void {
    this.projectForm.patchValue({
      id: this.project?.id,
      name: this.project?.name,
      description: this.project?.description,
      academicLevel: this.project?.academicLevel,
      qualification: this.project?.qualification,
      methodology: this.project?.methodology,
      subjectArea: this.project?.subjectArea,
      subjectKeyWords: this.project?.subjectKeyWords,
      urgencyLevel: this.project?.urgencyLevel,
      deadline: this.project?.deadline?.toDate(),
      isPrivateRequest: this.project?.isPrivateRequest ?? false
    });
  }

  private async initDocuments(): Promise<void> {
    this.documentUploaderComponent.files = [];
    this.isFetchingFiles = true;
    await this.project.projectDocuments.forEach(async d => {
      const file = await fetch(d.documentUrl).then(r => r.blob())
        .then(b => new File([b], d.document.originalFileName, { type: d.document.fileType }));
      this.documentUploaderComponent.files.push(file);
    });
    this.isFetchingFiles = false;
  }

  private initAvailabilities(): void {
    const availablilities: Availability[] = [];
    this.project.projectAvailabilities.forEach(a => {
      const idx = availablilities.findIndex(i => i.dayOfWeek === a.dayOfWeek);
      if (idx > -1) {
        availablilities[idx].times = [
          ...(availablilities[idx].times ?? []),
          {
            startTime: DateTimeHelper.convertFromHhMmStr(a.startTime),
            endTime: DateTimeHelper.convertFromHhMmStr(a.endTime)
          }
        ];
      } else {
        availablilities.push({
          dayOfWeek: a.dayOfWeek,
          times: [{
              startTime: DateTimeHelper.convertFromHhMmStr(a.startTime),
              endTime: DateTimeHelper.convertFromHhMmStr(a.endTime)
          }]
        });
      }
    });
    this.availabilitySettingComponent.availabilities = availablilities;
  }

  private initStaticServices(services: Service2Dto[]): void {
    this.serviceCategories = services;
    if (this.serviceCategories && this.serviceCategories.length > 0) {
      const defaultSelection = this.serviceCategories.find(s => s.name.toLocaleLowerCase().trim() === 'academic tutoring');
      if (defaultSelection) {
        this.selectedServiceCategories.push(defaultSelection);
      }
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
    this.isSaving = true;
    let existing: UpdateProjectDto = new UpdateProjectDto();
    existing = Object.assign({}, this.projectForm.value);
    existing.deadline = moment(this.deadline?.value).startOf('day');

    const documents = this.documentUploaderComponent.files.map(file => {
      const fileParameter: FileParameter = {
        fileName: file.name,
        data: file,
      };
      return fileParameter;
    });

    existing.projectAvailabilities = this.availabilitySettingComponent.availabilities?.reduce((arr, curr) =>
    [...arr, ...curr.times.map(t => {
      const availability: ProjectAvailabilityDto = new ProjectAvailabilityDto();
      availability.dayOfWeek = curr.dayOfWeek;
      availability.startTime = DateTimeHelper.convertToHhMmStr(t.startTime);
      availability.endTime = DateTimeHelper.convertToHhMmStr(t.endTime);
      return availability;
    })], []) ?? [];

    this._projectsService.update(existing)
      .pipe(
        switchMap(
          (updatedProject) =>
          this.hasFilesToUpload ? this._projectsService.uploadProjectDocuments(updatedProject.id, documents) : of(updatedProject)
        ),
        takeUntil(this.destroyed$),
        finalize(() => this.isSaving = false),
      )
      .subscribe((updatedProject) => {
        this.hasFilesToUpload = false;
        this.project = updatedProject;
        this._projectService.project = updatedProject;
        this.notify.success(this.l('SavedSuccessfully'));
      });
  }

  onBackClick(): void {
    this._router.navigate(['/app/service-wizard/services']);
  }

  private getAcademicLevelQualifications(): void {
    this.academicLevelQualifications = [];
    this._projectsService.getAcademicLevelQualifications(this.academicLevel?.value)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        this.academicLevelQualifications = responses;
      });
  }

  onAcademicLevelSelect(academicLevel: string): void {
    this.academicLevelValue = academicLevel;
    this.academicLevel.setValue(academicLevel);
    this.qualification.setValue(null);
    if (!this.showMethodology) {
      this.methodology.setValue(null);
    }
    this.getAcademicLevelQualifications();
  }

  onQualificationSelect(qualification: string): void {
    this.qualificationValue = qualification;
    this.qualification.setValue(qualification);
  }

  onMethodologySelect(methodology: string): void {
    this.methodologyValue = methodology;
    this.methodology.setValue(methodology);
  }

  onSubjectAreaSelect(subjectArea: string): void {
    this.subjectAreaValue = subjectArea;
    this.subjectArea.setValue(subjectArea);
  }

  onUrgencyLevelSelect(urgencyLevel: string): void {
    this.urgencyLevelValue = urgencyLevel;
    this.urgencyLevel.setValue(urgencyLevel);
  }

  onSearchKeyWordKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.addSubjectKeyWord();
    }
  }

  onSearchKeyWordBlur(): void {
    this.addSubjectKeyWord();
  }

  onRemoveSubjectKeyWordClick(keyWord: string): void {
    const keyWords = [...this.subjectKeyWordsList];
    const index = keyWords.findIndex(e => e === keyWord);
    if (index > -1) {
      keyWords.splice(index, 1);
      this.subjectKeyWords.setValue(keyWords.join());
    }
  }

  private addSubjectKeyWord(): void {
    if (this.subjectKeyWordValue) {
      const keyWord = this.subjectKeyWordValue.toLowerCase();
      const index = this.subjectKeyWordsList.findIndex(e => e.toLowerCase() === keyWord);
      if (index < 0) {
        this.subjectKeyWords.setValue(`${this.subjectKeyWords.value},${keyWord}`);
      }
    }
    this.subjectKeyWordValue = undefined;
  }

  toggleEditProject(edit: boolean): void {
    this.isEditing = edit;

    if (edit) {
      this.projectNameInput.nativeElement.focus();
    } else {
      this.initForm();
      this.initDocuments();
      this.initAvailabilities();
    }

    for (var control in this.projectForm.controls) {
      if (edit) this.projectForm.controls[control].enable();
      else this.projectForm.controls[control].disable();
    }
  }


}
