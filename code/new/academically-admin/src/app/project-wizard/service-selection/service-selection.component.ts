import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateProjectDto, Service2Dto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ServiceWizardService } from '../_services/service-wizard.service';

@Component({
  selector: 'app-service-level',
  templateUrl: './service-selection.component.html',
  styleUrls: ['./service-selection.component.less'],
  animations: [appModuleAnimation()],
})
export class ServiceSelectionComponent extends AppComponentBase implements OnInit {
  services: Service2Dto[] = [];
  selectedServices: Service2Dto[] = [];
  createProjectDto: CreateProjectDto = new CreateProjectDto();
  isLoading = false;

  constructor(
    injector: Injector,
    private _router: Router,
    private _servicesService: ServicesServiceProxy,
    private _serviceWizardService: ServiceWizardService,
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
        this.services = response;

        if (this.services && this.services.length > 0) {
          const defaultSelection = this.services.find(s => s.name.toLocaleLowerCase().trim() === 'academic tutoring');
          if (defaultSelection) {
            this.selectedServices.push(defaultSelection);
          }
        }

        if (this.createProjectDto && this.createProjectDto.serviceLevel3) {
          this.selectedServices = this.selectedServices.filter(l => l.id === this.createProjectDto.serviceLevel3);
        } else if (this.services && this.services.length > 0) {
          const defaultSelection = this.services.find(s => s.name.toLocaleLowerCase().trim() === 'academic tutoring');
          if (defaultSelection) {
            this.selectedServices.push(defaultSelection);
          }
        }
      });
  }

  getSelected(id: string): Service2Dto {
    return this.selectedServices.find(s => s.id === id);
  }

  onCheckChange(checked: boolean, serviceDto: Service2Dto): void {
    const index = this.selectedServices.findIndex(s => s.id === serviceDto.id);
    if (index > -1 && !checked) {
      this.selectedServices.splice(index, 1);
    } else if (index === -1 && checked) {
      this.selectedServices = [serviceDto];
    }
  }

  onBackClick(): void {
    this._router.navigate(['/app/project-wizard/service-level']);
  }

  onNextClick(): void {
    if (this.validStep()) {
      this._router.navigate(['/app/project-wizard/create']);
    }
  }

  private validStep(): boolean {
    if (!this.selectedServices || this.selectedServices.length === 0) {
      return false;
    }

    // this is temporary as the schema is not yet finalize.
    this.createProjectDto.serviceLevel3 = this.selectedServices[0].id;
    this.createProjectDto.serviceNameLevel3 = this.selectedServices[0].name;
    this._serviceWizardService.currentStep = this.createProjectDto;
    return true;
  }
}
