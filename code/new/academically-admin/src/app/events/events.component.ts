import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateEventDto, EventsServiceProxy, EventType } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';
import { ChooseTemplateComponent } from './_components/choose-template/choose-template.component';
import { CreateEventComponent } from './_components/create-event/create-event.component';
import { EventTemplate } from './_models/event-template';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less'],
  animations: [appModuleAnimation()],
})
export class EventsComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _router: Router,
    private _eventsService: EventsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onNewEventClick(): void {
    this.showChooseTemplateModal();
  }

  private showChooseTemplateModal(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ChooseTemplateComponent>;
    const modal = this._modalService.show(ChooseTemplateComponent, modalSettings).content;
    modal.selectTemplate.subscribe((template: EventTemplate) => {
      const model = new CreateEventDto();
      model.type = template.type;
      model.name = '';

      const createEventModalSettings = this.defaultModalSettings as ModalOptions<CreateEventComponent>;
      createEventModalSettings.initialState = {
        model: model,
      };
      const createEventModal = this._modalService.show(CreateEventComponent, createEventModalSettings).content;
      createEventModal.createCancel.subscribe(() => {
        this.showChooseTemplateModal();
      });
      createEventModal.createEvent.subscribe(article => {
        this._eventsService.create(article)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(response => {
            this.notify.success(this.l('SavedSuccessfully'));
            if (response.type === EventType.SingleEvent) {
              this._router.navigate(['/app/events/', response.id]);
            } else {
              this._router.navigate(['/app/events/event-series/', response.id]);
            }
          });
      });
    });
  }
}
