import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateProjectDto, Service2Dto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ServiceWizardService } from '../_services/service-wizard.service';

@Component({
  selector: 'app-service-level',
  templateUrl: './service-level.component.html',
  styleUrls: ['./service-level.component.less'],
  animations: [appModuleAnimation()],
})
export class ServiceLevelComponent extends AppComponentBase implements OnInit {
  serviceLevels: Service2Dto[] = [];
  selectedServiceLevels: Service2Dto[] = [];
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
    this._servicesService.getStaticServiceLevels()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(response => {
        this.serviceLevels = response;

        if (this.createProjectDto && this.createProjectDto.serviceLevel2) {
          this.selectedServiceLevels = this.serviceLevels.filter(l => l.id === this.createProjectDto.serviceLevel2);
        }
      });
  }

  getSelected(id: string): Service2Dto {
    return this.selectedServiceLevels.find(s => s.id === id);
  }

  onCheckChange(checked: boolean, serviceDto: Service2Dto): void {
    const index = this.selectedServiceLevels.findIndex(s => s.id === serviceDto.id);
    if (index > -1 && !checked) {
      this.selectedServiceLevels.splice(index, 1);
    } else if (index === -1 && checked) {
      this.selectedServiceLevels = [serviceDto];
    }
  }

  onBackClick(): void {
    this._router.navigate(['/app/service-wizard']);
  }

  onNextClick(): void {
    if (this.validStep()) {
      this._router.navigate(['/app/service-wizard/services']);
    }
  }

  private validStep(): boolean {
    if (!this.selectedServiceLevels || this.selectedServiceLevels.length === 0) {
      return false;
    }

    // TODO: this is temporary as the schema is not yet finalize.
    this.createProjectDto.serviceLevel2 = this.selectedServiceLevels[0].id;
    this.createProjectDto.serviceNameLevel2 = this.selectedServiceLevels[0].name;
    this._serviceWizardService.currentStep = this.createProjectDto;
    return true;
  }
}
