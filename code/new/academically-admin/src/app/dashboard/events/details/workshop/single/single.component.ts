import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '@app/dashboard/events/_services/event.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { EventDto, EventsServiceProxy, EventStatus, ServicesType } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { CommunityPostService } from '@shared/services/community-post.service';
import { MenuItem, ServiceCreateService } from '@shared/services/service-create.service';


@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.less'],
  animations: [appModuleAnimation()],
})
export class SingleComponent extends AppComponentBase implements OnInit {
  id: string;
  model = new EventDto();
  isLoading = false;
  WorkshopStatus = EventStatus;
  defaultMenuItem: MenuItem;
  menuItems: MenuItem[] = [
    {
      id: 'details',
      label: 'Details',
      icon: 'assets/img/service/create/list.svg',
      iconHover: 'assets/img/service/create/list-hover.svg',
      infoText: 'Here, you can input all the details for your article. This information will be visible to potential clients, so keep it clear and informative.'
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: 'assets/img/service/create/layers.svg',
      iconHover: 'assets/img/service/create/layers-hover.svg',
      infoText: 'Here 2, you can input all the details for your article. This information will be visible to potential clients, so keep it clear and informative.'
    },
    {
      id: 'studio',
      label: 'Studio',
      icon: 'assets/img/service/create/clipboard.svg',
      iconHover: 'assets/img/service/create/clipboard-hover.svg',
      infoText: 'Here 3, you can input all the details for your article. This information will be visible to potential clients, so keep it clear and informative.'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'assets/img/service/create/settings.svg',
      iconHover: 'assets/img/service/create/settings-hover.svg',
      infoText: 'Here 4, you can input all the details for your article. This information will be visible to potential clients, so keep it clear and informative.'
    },
  ];

  readonly ServicesType = ServicesType;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _workshopService: EventService,
    private _workshopsService: EventsServiceProxy,
    private _communityPostService: CommunityPostService,
    private _modalDialogService: ModalDialogService,
    private _serviceCreateService: ServiceCreateService
  ) {
    super(injector);
    this._serviceCreateService.setDefaultMenuItem(this.menuItems[0]);
    this._serviceCreateService.getDefaultMenuItem().subscribe(x => this.defaultMenuItem = x);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
      }
    });
  }

  ngOnInit(): void {
    this.getWorkshop();
    this._workshopService.eventCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id) {
          this.model = response;
        }
      });
  }

  onPublishClick(): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('PublishWorkshopConfirmationMessage'),
      confirmCb: (): void => {
        this._workshopsService.updateStatus(this.model.id, EventStatus.Published)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.model.status = EventStatus.Published;
            this.notify.success(this.l('SavedSuccessfully'));
            this._communityPostService.hasNewItemToShare({ serviceId: this.model.id });
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  onUnpublishClick(): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('UnpublishWorkshopConfirmationMessage'),
      confirmCb: (): void => {
        this._workshopsService.updateStatus(this.model.id, EventStatus.Draft)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.model.status = EventStatus.Draft;
            this.notify.success(this.l('SavedSuccessfully'));
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  private getWorkshop(): void {
    this._workshopsService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._workshopService.eventCreated = response;
      });
  }
}
