import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceDto, ServiceExpertiseLevel, UserServiceDto, UserServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { CreateEditServiceComponent } from './_components/create-edit-service/create-edit-service.component';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.less']
})
export class ServicesComponent extends AppComponentBase implements OnInit {
  @Input() userId: number;
  ServiceExptertiseLevel = ServiceExpertiseLevel;
  collapsedItems: boolean[] = [];
  categories: ServiceDto[] = [];
  isLoading = false;
  isServicesLoading = false;
  userServices: UserServiceDto[] = [];
  selectedService: ServiceDto;

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
      })
  }

  onServiceClick(service: ServiceDto): void {
    this.getUserServices(service);
  }

  private getServiceTree(): void {
    this.isLoading = true;
    this._userServicesService.getServiceTree(this.userId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(services => {
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
    this._userServicesService.get(this.userId ?? this.appSession.userId, service.id)
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
