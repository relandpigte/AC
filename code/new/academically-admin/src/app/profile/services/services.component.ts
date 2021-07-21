import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceDto, ServiceExpertiseLevel, UserServiceDto, UserServiceForListDto, UserServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { CreateEditServiceComponent } from './_components/create-edit-service/create-edit-service.component';
import { Services } from '../../../assets/services-icon.json';
import * as _ from 'lodash';
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
  @Input() userId: number;
  ServiceExptertiseLevel = ServiceExpertiseLevel;
  collapsedItems: boolean[] = [];
  categories: ServiceDto[] = [];
  categoryTree: any;
  isLoading = false;
  isServicesLoading = false;
  userServices: UserServiceForListDto[] = [];
  selectedService: ServiceDto;
  categoryMenuItem: ServiceMenuItem[] = [];
  deleteLoaders: boolean[] = [];

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

  canCreate(): boolean {
    return this.permission.isGranted('Pages.Profile.Services.Create') || this.permission.isGranted('Pages.TutorWizard.ServicesOffered.Create');
  }

  canUpdate(): boolean {
    return this.permission.isGranted('Pages.Profile.Services.Update') || this.permission.isGranted('Pages.TutorWizard.ServicesOffered.Update');
  }

  canDelete(): boolean {
    return this.permission.isGranted('Pages.Profile.Services.Delete') || this.permission.isGranted('Pages.TutorWizard.ServicesOffered.Delete');
  }

  onAddClick(): void {
    this.showCreateEditServiceMdoal();
  }

  onEditClick(service: ServiceDto): void {
    this.showCreateEditServiceMdoal(_.cloneDeep(service));
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

  onDeleteClick(id: string): void {
    this.message.confirm(
      undefined,
      undefined,
      (result: boolean) => {
        if (result) {
          this.deleteLoaders[id] = true;
          this._userServicesService.delete(id)
            .pipe(finalize(() => {
              this.deleteLoaders[id] = false;
            }))
            .subscribe(() => {
              this.getServiceTree();
              this.notify.success('SuccessfullyDeleted');
            });
        }
      }
    );
  }

  private getServiceTree(): void {
    this.isLoading = true;
    this.userId = this.userId ?? this.appSession.userId;
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
        } else {
          this.userServices = [];
          this.selectedService = null;
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

  private showCreateEditServiceMdoal(service?: ServiceDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditServiceComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      serviceId: service?.id
    };

    const modal = this._modalService.show(CreateEditServiceComponent, modalSettings).content;
    modal.modelSaved
      .pipe(
        takeUntil(this.destroyed$),
      ).subscribe(() => {
        this.getServiceTree();
      });
  }
}
