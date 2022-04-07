import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { EventsServiceProxy, EventDto, PricingType, StudentEventDto } from '@shared/service-proxies/service-proxies';
import { PortalService } from '../../../_services/portal.service';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-related',
  templateUrl: './related.component.html',
  styleUrls: ['./related.component.less']
})
export class RelatedComponent extends AppComponentBase implements OnInit {
  event: EventDto = new EventDto();
  relatedEvents: EventDto[] = [];
  purchasedEvents: string[] = [];

  PricingType = PricingType;

  constructor(
    injector: Injector,
    portalService: PortalService,
    private _eventsService: EventsServiceProxy,
  ) {
    super(injector);
    portalService.event$.pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          this.event = response;
          this.getRelatedEvents();
        }
      });
  }

  ngOnInit(): void {
  }

  onPurchaseClick(event: EventDto): void {
    this.message.confirm(this.l('PurchaseEventConfirmationMessage'), undefined,
      (result => {
        if (result) {
          const studentEvent = new StudentEventDto();
          studentEvent.eventId = event.id;
          studentEvent.saveOnly = false;
          this._eventsService.purchase(studentEvent)
            .pipe(
              takeUntil(this.destroyed$),
            )
            .subscribe(response => {
              this.purchasedEvents[event.id] = true;
              this.notify.success(this.l('EventPurchaseSuccessMessage'));
            });
        }
      }));
  }

  private getRelatedEvents(): void {
    this._eventsService.getAllRelated(this.event.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(reponses => {
        this.relatedEvents = reponses;
        _.each(this.relatedEvents, relatedEvent => {
          if (relatedEvent.pricingType !== PricingType.Free) {
            this.getStudentEvent(relatedEvent.id);
          }
        });
      });
  }

  private getStudentEvent(eventId: string): void {
    this._eventsService.getPurchased(eventId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id) {
          this.purchasedEvents[eventId] = true;
        }
      });
  }
}
