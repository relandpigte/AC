import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateProjectDto, ProjectsServiceProxy, Service2Dto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil, switchMap } from 'rxjs/operators';
import { ServiceWizardService } from '../_services/service-wizard.service';
import { Observable, Observer, of } from 'rxjs';

@Component({
  selector: 'app-service-level',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.less'],
  animations: [appModuleAnimation()],
})
export class CreateProjectComponent extends AppComponentBase implements OnInit {
  serviceCategories: Service2Dto[] = [];
  selectedServiceCategories: Service2Dto[] = [];
  model: CreateProjectDto = new CreateProjectDto();
  isLoading = false;
  academicLevels: string[] = [];
  academicLevelQualifications: string[] = [];
  methodologies: string[] = [];
  subjectAreas: string[] = [];

  subjectKeywordsTypeaheadSource: Observable<string[]>;

  constructor(
    injector: Injector,
    private _router: Router,
    private _servicesService: ServicesServiceProxy,
    private _projectsService: ProjectsServiceProxy,
    private _serviceWizardService: ServiceWizardService
  ) {
    super(injector);
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
    this.getSubjectKeywords();
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
    console.log(this.model);
    return;
    this.isLoading = true;
    this._projectsService.create(this.model)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        this._router.navigate(['/app/home']);
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

  // onPublicationTagSelect(publicationTag: PublicationTagDto): void {
  //   this.addTagToUserPublication(publicationTag.name);
  // }

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

  private getSubjectKeywords(): void {
    this.subjectKeywordsTypeaheadSource = new Observable((observer: Observer<string>) => {
      observer.next(this.model.subjectKeyWords);
    }).pipe(
      switchMap((query: string) => {
        return of([]);
      })
    );
  }

  // private addSubjectKeywordsToModel(keyword: string): void {
  //   if (!this.userPublication.tags.includes(tag.toLowerCase())) {
  //     this.userPublication.tags.push(tag.toLowerCase());
  //   }
  //   this.publicationTag = '';
  // }
}
