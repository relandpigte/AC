import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DisciplineTaxonomiesServiceProxy, DisciplineTaxonomyDto, ServiceDto, ServiceExpertiseLevel, ServiceMappingDto, ServicesServiceProxy, SubjectDto, UserServiceDto, UserServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash-es';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable, Observer } from 'rxjs';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { StudyFieldsTreeComponent } from '../study-fields-tree/study-fields-tree.component';
import { SuggestServiceSubjectComponent } from '../suggest-service-subject/suggest-service-subject.component';

class CreateEditServiceModel {
  id?: string;
  categoryId: string;
  serviceId: string;
  levelId: string;
  title: string;
  description: string;
  expertiseLevel: number;
  disciplineTaxonomies: DisciplineTaxonomyDto[] = [];
  subjects: SubjectDto[] = [];
  constructor(data?: UserServiceDto) {
    if (data) {
        for (const property in data) {
            if (data.hasOwnProperty(property)) {
              (<any>this)[property] = (<any>data)[property];
            }
        }
    }
  }
}

@Component({
  selector: 'app-create-edit-service',
  templateUrl: './create-edit-service.component.html',
  styleUrls: ['./create-edit-service.component.less']
})
export class CreateEditServiceComponent extends AppComponentBase implements OnInit {
  @Output() modelSaved = new EventEmitter();
  serviceId: string;

  userService: UserServiceDto;
  userServiceId: string;

  ServiceExptertiseLevel = ServiceExpertiseLevel;
  model: CreateEditServiceModel = new CreateEditServiceModel();
  categories: ServiceDto[] = [];
  services: ServiceDto[] = [];
  levels: ServiceMappingDto[] = [];
  selectedCategory: ServiceDto;
  selectedService: ServiceDto;
  selectedLevel: ServiceMappingDto;
  disciplineTaxonomiesTypeaheadSource: Observable<DisciplineTaxonomyDto[]>;
  disciplineTaxonomy: string;
  subjects: SubjectDto[];
  subject: string;
  isLoading = false;
  isSelectionLoading = false;
  levelsWithSubjects = ['GCSE', 'A Level'];

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _modalService: BsModalService,
    private _servicesService: ServicesServiceProxy,
    private _userServicesService: UserServicesServiceProxy,
    private _disciplineTaxonomiesService: DisciplineTaxonomiesServiceProxy,
  ) {
    super(injector);
  }

  get HasValidSubject(): boolean {
    if (this.levelsWithSubjects.includes(this.selectedLevel?.service?.name) ) {
      return this.model.subjects.length > 0;
    }
    return true;
  }

  ngOnInit(): void {
    this.getCategories();
    this.getDisciplineTaxonomies();
    if (this.serviceId) {
      this.getService();
    }
  }

  onFormSubmit(): void {
    this.isLoading = true;

    const userService = new UserServiceDto();
    userService.id = this.model.id;
    userService.title = this.model.title;
    userService.description = this.model.description;
    userService.expertiseLevel = this.model.expertiseLevel;
    userService.serviceMappingId = this.model.levelId;
    userService.subjects = this.model.subjects;
    userService.disciplineTaxonomies = this.model.disciplineTaxonomies;

    (userService.id ?
      this._userServicesService.update(userService) :
      this._userServicesService.create(userService))
      .pipe(
        takeUntil(this.destroyed$), finalize(() => this.isLoading = false)
      )
      .subscribe(() => {
        this.modelSaved.emit();
        this.notify.success(this.l('SavedSuccessfully'));
        this._modal.hide();
      });
  }

  onCategoryChange(): void {
    this.selectedCategory = this.categories.find(e => e.id === this.model.categoryId);
    this.levels = [];
    this.model.serviceId = undefined;
    this.model.levelId = undefined;
    this.getServices();
  }

  onServiceChange(): void {
    this.selectedService = this.services.find(e => e.id === this.model.serviceId);
    this.subject = undefined;
    this.subjects = [];
    this.model.levelId = undefined;
    this.model.subjects = [];
    this.model.disciplineTaxonomies = [];
    this.getLevels();
  }

  onLevelChange(): void {
    this.subject = undefined;
    this.subjects = [];
    this.model.subjects = [];
    this.model.disciplineTaxonomies = [];
    this.setSelectedLevel();
  }

  onDisciplineTaxonomySelect(disciplineTaxonomy: DisciplineTaxonomyDto): void {
    this.disciplineTaxonomy = '';
    this.model.disciplineTaxonomies.push(disciplineTaxonomy);
  }

  onRemoveDisciplineTaxonomyClick(id: string): void {
    const index = this.model.disciplineTaxonomies.findIndex((e: DisciplineTaxonomyDto) => e.id === id);
    if (index > -1) {
      this.model.disciplineTaxonomies.splice(index, 1);
    }
  }

  onSubjectSelect(subject: SubjectDto): void {
    this.subject = '';
    this.model.subjects.push(subject);
  }

  onRemoveSubjectClick(id: string): void {
    const index = this.model.subjects.findIndex((e: SubjectDto) => e.id === id);
    if (index > -1) {
      this.model.subjects.splice(index, 1);
    }
  }

  onSuggestSubjectClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<SuggestServiceSubjectComponent>;
    modalSettings.initialState = {
      categoryName: this.selectedCategory.name,
      serviceName: this.selectedService.name,
      levelName: this.selectedLevel.service.name,
      levelId: this.selectedLevel.service.id,
    };
    const modal = this._modalService.show(SuggestServiceSubjectComponent, modalSettings).content;
    modal.modelSaved
      .pipe(
        takeUntil(this.destroyed$),
      ).subscribe(() => {
        this.getSubjects();
      });
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onAddResearchFieldsClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<StudyFieldsTreeComponent>;
    modalSettings.class = 'modal-lg';
    const modal = this._modalService.show(StudyFieldsTreeComponent, modalSettings).content;
    modal.modalSave.subscribe((selectedResearchFields: DisciplineTaxonomyDto[]) => {
      selectedResearchFields.forEach(selectedResearchField => {
        const isExisting = this.model.disciplineTaxonomies
          .find(e => e.id === selectedResearchField.id);
        if (!isExisting) {
          this.model.disciplineTaxonomies.push(selectedResearchField);
        }
      });
    });
  }

  private getCategories(): void {
    this.isSelectionLoading = true;
    this._servicesService.getCategories()
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isSelectionLoading = false;
        }),
      )
      .subscribe(categories => {
        this.categories = categories;
      });
  }

  private getServices(): void {

    this.isSelectionLoading = true;
    this._servicesService.getServices(this.model.categoryId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isSelectionLoading = false;
        }),
      )
      .subscribe(services => {
        this.services = services;

        if (this.userService && this.model.levelId) {
          this.getLevels();
        }
      });
  }

  private getLevels(): void {
    this.isSelectionLoading = true;
    this._servicesService.getLevels(this.model.categoryId, this.model.serviceId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isSelectionLoading = false;
        }),
      )
      .subscribe(levels => {
        this.levels = levels;
        this.setSelectedLevel();
      });
  }

  private getDisciplineTaxonomies(): void {
    this.disciplineTaxonomiesTypeaheadSource = new Observable((observer: Observer<string>) => {
      observer.next(this.disciplineTaxonomy);
    }).pipe(
      takeUntil(this.destroyed$),
      switchMap((query: string) => {
        return this._disciplineTaxonomiesService.search(query, false);
      })
    );
  }

  private getSubjects(): void {
    this.isSelectionLoading = true;
    this._servicesService.getSubjects(this.selectedLevel.service.name)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isSelectionLoading = false;
        }),
      )
      .subscribe(subjects => {
        this.subjects = subjects;
      });
  }

  private getService(): void {
    this.isLoading = true;
    this._userServicesService.getService(this.serviceId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(service => {
        this.model = new CreateEditServiceModel(service);
        this.userService = service;
        this.model.categoryId = service.serviceMapping.node1Id;
        this.model.serviceId = service.serviceMapping.node2Id;
        this.model.levelId = service.serviceMapping.id;
        this.getServices();
      });
  }

  private setSelectedLevel(): void {
    if (this.model.levelId) {
      this.selectedLevel = this.levels.find(e => e.id === this.model.levelId);
      if (this.selectedLevel && this.levelsWithSubjects.includes(this.selectedLevel.service.name)) {
        this.getSubjects();
      }
    } else {
      this.selectedLevel = undefined;
    }
  }
}
