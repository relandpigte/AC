import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceDto, ServiceExpertiseLevel, UserServiceDto, UserServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { CreateEditServiceComponent } from './_components/create-edit-service/create-edit-service.component';
import { Services } from '../../../assets/services-icon.json';
class ServiceMenuItem extends ServiceDto {
  icon: string;
  isActive?: boolean;
  isCollapsed?: boolean;

  id: string;
  name: string | undefined;
  serviceMappingId: string;
  children: ServiceMenuItem[] | undefined;
}
@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.less']
})
export class ServicesComponent extends AppComponentBase implements OnInit {
  ServiceExptertiseLevel = ServiceExpertiseLevel;
  collapsedItems: boolean[] = [];
  categories: ServiceDto[] = [];
  categoryTree: any;
  isLoading = false;
  isServicesLoading = false;
  userServices: UserServiceDto[] = [];
  selectedService: ServiceDto;
  categoryMenuItem: ServiceMenuItem[] = [];

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _userServicesService: UserServicesServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getServiceTree();
  }

  onToggleCollapse(id: number): void {
    this.collapsedItems[id] = !this.collapsedItems[id];
  }

  onAddClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditServiceComponent>;
    modalSettings.class = 'modal-lg';
    const modal = this._modalService.show(CreateEditServiceComponent, modalSettings).content;
    modal.modelSaved
      .pipe(
        takeUntil(this.destroyed$),
      ).subscribe(() => {
        this.getServiceTree();
      });
  }

  onServiceClick(service: ServiceDto): void {
    this.getUserServices(service);
  }

  getServiceIcon(name: string): string {
    if (!name) {
      return null;
    }

    const service = Services.find(s => s.name.toLocaleLowerCase() === name.toLocaleLowerCase().trim());
    return service?.icon;
  }

  onEditClick(id: string): void {

  }

  onDeleteClick(id: string): void {

  }

  private getServiceTree(): void {
    this.isLoading = true;
    this._userServicesService.getServiceTree(this.appSession.userId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(services => {
        console.log(services);




        this.categories = services;
        if (this.categories && this.categories.length) {
          if (!this.selectedService) {
            this.selectedService = this.categories[0].children[0].children[0];
          }
          this.getUserServices(this.selectedService);
        }
      });
  }

  private getUserServices(service: ServiceDto): void {
    this.isServicesLoading = true;
    this._userServicesService.get(this.appSession.userId, service.id)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isServicesLoading = false;
        }),
      )
      .subscribe(userServices => {
        this.selectedService = service;
        this.userServices = userServices;
      });
  }

}
