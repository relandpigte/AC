import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { Service2Dto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { debug } from 'console';
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
  isLoading = false;

  constructor(
    injector: Injector,
    private _router: Router,
    private _route: ActivatedRoute,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this._servicesService.getAllCategories()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(response => {
        this.serviceCategories = response;

        if (this.serviceCategories && this.serviceCategories.length > 0) {
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
    }  else if (index === -1 && checked) {
      this.selectedServiceCategories.push(serviceDto);
    }

    console.log(this.selectedServiceCategories);
  }

  onCancelClick(): void {
    this.message.confirm(
      this.l('CancelServiceWizardMessage'),
      undefined,
      (result: boolean) => {
        if (result) {
          this._router.navigate(['/app/home']);
        }
      }
    );
  }

  onNextClick(): void {

  }
}
