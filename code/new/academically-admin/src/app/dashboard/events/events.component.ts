import { Component, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { WorkshopsServiceProxy, CreateWorkshopDto, WorkshopType, CreateEventDto, EventType, EventsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CreateWorkshopComponent } from './_components/create-workshop/create-workshop.component';
import { CreateBroadcastComponent } from './_components/create-broadcast/create-broadcast.component';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ChooseTemplateComponent } from './_components/choose-template/choose-template.component';
import { EventsTemplate } from './_models/events-template';

@Component({
  selector: 'app-dashboard-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less'],
  animations: [appModuleAnimation()],
})
export class EventsComponent extends AppComponentBase  {
  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: BsModalService,
    private _eventsService: EventsServiceProxy,
    private _workshopService: WorkshopsServiceProxy
  ) {
    super(injector);
  }

  onNewBroadcastClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ChooseTemplateComponent>;
    modalSettings.initialState = { type: 'Broadcast' };
    const modal = this._modalService.show(ChooseTemplateComponent, modalSettings).content;
    modal.selectTemplate.subscribe((template: EventsTemplate) => {
      const model = new CreateEventDto();
      model.name = '';
      model.type = template.type as EventType;

      const createBroadcastModalSettings = this.defaultModalSettings as ModalOptions<CreateBroadcastComponent>;
      createBroadcastModalSettings.initialState = { model: model };
      const createBroadcastModal = this._modalService.show(CreateBroadcastComponent, createBroadcastModalSettings).content;
      createBroadcastModal.createBroadcast.subscribe(broadcast => {

        this._eventsService.create(broadcast)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(response => {
            this.notify.success(this.l('SavedSuccessfully'));
            if (response.type === EventType.SingleEvent) {
              this._router.navigate(['/app/dashboard/events/broadcast/', response.id]);
            } else {
              this._router.navigate(['/app/dashboard/events/broadcast/series/', response.id]);
            }
          });
      });
    });
  }

  onNewWorkshopClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ChooseTemplateComponent>;
    modalSettings.initialState = { type: 'Workshop' };
    const modal = this._modalService.show(ChooseTemplateComponent, modalSettings).content;
    modal.selectTemplate.subscribe((template: EventsTemplate) => {
      const model = new CreateWorkshopDto();
      model.name = '';
      model.type = template.type as WorkshopType;

      const createWorkshopModalSettings = this.defaultModalSettings as ModalOptions<CreateWorkshopComponent>;
      createWorkshopModalSettings.initialState = { model: model };
      const createWorkshopModal = this._modalService.show(CreateWorkshopComponent, createWorkshopModalSettings).content;
      createWorkshopModal.createWorkshop.subscribe(workshop => {
        this._workshopService.create(workshop)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(response => {
            this.notify.success(this.l('SavedSuccessfully'));
            if (response.type === WorkshopType.Single) {
              this._router.navigate(['/app/dashboard/events/workshop/', response.id]);
            } else {
              this._router.navigate(['/app/dashboard/events/workshop/series/', response.id]);
            }
          });
      });
    });
  }
}
