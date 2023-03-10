import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateEventDto, EventCategory, EventsServiceProxy, EventType } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';
import { ChooseTemplateComponent } from './_components/choose-template/choose-template.component';
import { CreateBroadcastComponent } from './_components/create-broadcast/create-broadcast.component';
import { CreateWorkshopComponent } from './_components/create-workshop/create-workshop.component';
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
    private _eventsService: EventsServiceProxy
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
      model.category = EventCategory.Broadcast;
      model.type = template.type as EventType;

      const createBroadcastModalSettings = this.defaultModalSettings as ModalOptions<CreateBroadcastComponent>;
      createBroadcastModalSettings.initialState = { model: model };
      const createBroadcastModal = this._modalService.show(CreateBroadcastComponent, createBroadcastModalSettings).content;
      createBroadcastModal.createBroadcast.subscribe(broadcast => {
        this._eventsService.create(broadcast)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(response => {
            this.notify.success(this.l('SavedSuccessfully'));
            if (response.type === EventType.Single) {
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
      const model = new CreateEventDto();
      model.name = '';
      model.category = EventCategory.Workshop;
      model.type = template.type as EventType;

      const createWorkshopModalSettings = this.defaultModalSettings as ModalOptions<CreateWorkshopComponent>;
      createWorkshopModalSettings.initialState = { model: model };
      const createWorkshopModal = this._modalService.show(CreateWorkshopComponent, createWorkshopModalSettings).content;
      createWorkshopModal.createWorkshop.subscribe(workshop => {
        this._eventsService.create(workshop)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(response => {
            this.notify.success(this.l('SavedSuccessfully'));
            if (response.type === EventType.Single) {
              this._router.navigate(['/app/dashboard/events/workshop/', response.id]);
            } else {
              this._router.navigate(['/app/dashboard/events/workshop/series/', response.id]);
            }
          });
      });
    });
  }
}
