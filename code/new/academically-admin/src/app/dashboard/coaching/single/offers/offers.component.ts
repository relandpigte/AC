import { Component, Injector, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { AppComponentBase } from '@shared/app-component-base';
import { ArticleService } from '@app/articles/_services/article.service';
import { CreateOfferComponent } from '@app/dashboard/events/portal/broadcast/student/portal/_components/offers/_components/create-offer/create-offer.component';
import { ServiceOfferDto, ServiceOfferStatus, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import { BehaviorSubject, combineLatest, of } from '@node_modules/rxjs';
import { switchMap } from '@node_modules/rxjs/operators';
import { ServiceCreateOfferComponent } from '@shared/components/service-create-offer/service-create-offer.component';
import { CoachingService } from '@app/dashboard/coaching/_services/coaching.service';

@Component({
  selector: 'app-coaching-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.less']
})
export class OffersComponent extends AppComponentBase implements OnInit {
  id: string;
  offers: ServiceOfferDto[] = [];
  isLoadingInitialData$ = new BehaviorSubject<boolean>(false);

  constructor(
    injector: Injector,
    private _coachingService: CoachingService,
    private _bsModalService: BsModalService,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
  }

  get isLoading$() { return combineLatest([this.isLoadingInitialData$]).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }
  get isOffersAvailable(): boolean { return this.offers?.length > 0; }

  ngOnInit(): void {
    this.isLoadingInitialData$.next(true);
    this._coachingService.coachingCreated$.subscribe(article => {
      if (!article) {
        return;
      }
      this.id = article.id;
      this.initCoachingOffers();
    });
  }

  onAddOffer(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ServiceCreateOfferComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered';
    modalSettings.initialState = { referenceId: this.id };
    const modal = this._bsModalService.show(ServiceCreateOfferComponent, modalSettings);

    modal.content.onSave.subscribe((o: ServiceOfferDto): void => {
      this.offers.push(o);
    });
  }

  private initCoachingOffers(): void {
    this._servicesService.getServiceOffers(this.id, ServiceOfferStatus.Queued, undefined)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingInitialData$.next(false)))
      .subscribe(o => this.offers = o);
  }
}
