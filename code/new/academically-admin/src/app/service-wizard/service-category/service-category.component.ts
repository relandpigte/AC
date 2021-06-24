import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateProjectDto, Service2Dto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { ServiceWizardService } from '../_services/service-wizard.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-service-category',
  templateUrl: './service-category.component.html',
  styleUrls: ['./service-category.component.less'],
  animations: [appModuleAnimation()],
})
export class ServiceCategoryComponent extends AppComponentBase implements OnInit {
  serviceCategories: Service2Dto[] = [];
  selectedServiceCategories: Service2Dto[] = [];
  createProjectDto: CreateProjectDto = new CreateProjectDto();
  isLoading = false;

  constructor(
    injector: Injector,
    private _router: Router,
    private _servicesService: ServicesServiceProxy,
    private _serviceWizardService: ServiceWizardService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._serviceWizardService.currentStep$.subscribe(project => {
      this.createProjectDto = project ?? new CreateProjectDto();
    });

    this.isLoading = true;
    this._servicesService.getAllCategories()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(response => {
        this.serviceCategories = response;

        if (this.createProjectDto && this.createProjectDto.serviceLevel1) {
          this.selectedServiceCategories = this.serviceCategories.filter(l => l.id === this.createProjectDto.serviceLevel1);
        } else if (this.serviceCategories && this.serviceCategories.length > 0) {
          const defaultSelection = this.serviceCategories.find(s => s.name.toLocaleLowerCase().trim() === 'academic support');
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
      this.selectedServiceCategories.push(serviceDto);
    }
  }

  onCancelClick(): void {
    this.message.confirm(
      this.l('CancelServiceWizardMessage'),
      undefined,
      (result: boolean) => {
        if (result) {
          this._serviceWizardService.clear();
          this._router.navigate(['/app/home']);
        }
      }
    );
  }

  onNextClick(): void {
    if (this.validStep()) {
      this._router.navigate(['/app/service-wizard/service-level']);
    }
  }

  private validStep(): boolean {
    if (!this.selectedServiceCategories || this.selectedServiceCategories.length === 0) {
      return false;
    }

    // TODO: this is temporary as the schema is not yet finalize.
    this.createProjectDto.serviceLevel1 = this.selectedServiceCategories[0].id;
    this.createProjectDto.serviceNameLevel1 = this.selectedServiceCategories[0].name;
    this._serviceWizardService.currentStep = this.createProjectDto;
    return true;
  }
}
