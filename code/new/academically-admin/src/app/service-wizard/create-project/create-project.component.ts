import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateProjectDto, ProjectsServiceProxy, Service2Dto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { ServiceWizardService } from '../_services/service-wizard.service';

@Component({
  selector: 'app-service-level',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.less'],
  animations: [appModuleAnimation()],
})
export class CreateProjectComponent extends AppComponentBase implements OnInit {
  serviceCategories: Service2Dto[] = [];
  selectedServiceCategories: Service2Dto[] = [];
  createProjectDto: CreateProjectDto = new CreateProjectDto();
  isLoading = false;

  constructor(
    injector: Injector,
    private _router: Router,
    private _servicesService: ServicesServiceProxy,
    private _projectsSErvice: ProjectsServiceProxy,
    private _serviceWizardService: ServiceWizardService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._serviceWizardService.currentStep$.subscribe(project => {
      this.createProjectDto = project ?? new CreateProjectDto();
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
    this._projectsSErvice.create(this.createProjectDto)
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
}
