import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { DragulaService } from 'ng2-dragula';
import * as _ from 'lodash';

import { AppComponentBase } from '@shared/app-component-base';
import { ServiceCreatePollComponent } from '@shared/components/service-create-poll/service-create-poll.component';
import { ServiceCreateQuizComponent } from '@shared/components/service-create-quiz/service-create-quiz.component';
import {
  ActivityType, CreateServiceActivityDto, ServiceActivityDto, ServiceOfferDto,
  ServicesServiceProxy, ServicesType, UpdateServiceActivityOrder
} from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.less']
})
export class ActivitiesComponent extends AppComponentBase implements OnInit, OnDestroy {
  id: string;
  activities: ServiceActivityDto[] = [];
  isLoadingInitialData$ = new BehaviorSubject<boolean>(false);
  activityGroup = 'Activities';

  constructor(
    injector: Injector,
    private _servicesService: ServicesServiceProxy,
    private _route: ActivatedRoute,
    private _modalService: BsModalService,
    private _dragulaService: DragulaService
  ) {
    super(injector);

    this._dragulaService.createGroup(this.activityGroup, {
      revertOnSpill: true,
      moves: (el, source, handle) => handle.classList.contains('drag-handle')
    });

    this._dragulaService.dropModel(this.activityGroup).subscribe(({ sourceModel }): void => {
      if (_.isEmpty(sourceModel)) {
        return;
      }
      const activityOrders: UpdateServiceActivityOrder[] = [];
      sourceModel.forEach((item, index): void => {
        activityOrders.push(new UpdateServiceActivityOrder({ displayOrder: index, id: item.id }));
      });

      this._servicesService.updateServiceActivityOrder(activityOrders)
        .pipe(takeUntil(this.destroyed$))
        .subscribe();
    });
  }

  get isLoading$() { return combineLatest([this.isLoadingInitialData$]).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }
  get isActivitiesAvailable(): boolean { return this.activities?.length > 0; }

  ngOnInit(): void {
    this.isLoadingInitialData$.next(true);
    this.id = this._route.snapshot.paramMap.get('id');
    this.initActivities();
  }

  ngOnDestroy(): void {
    this._dragulaService.destroy(this.activityGroup);
  }

  onAddPoll(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ServiceCreatePollComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      referenceId: this.id,
      serviceType: ServicesType.Event
    };
    const modal = this._modalService.show(ServiceCreatePollComponent, modalSettings).content;

    modal.modelSaved
      .pipe(takeUntil(this.destroyed$))
      .subscribe(poll => {
        this.notify.success(this.l('SavedSuccessfully'));
        const activity = new CreateServiceActivityDto({
          serviceId: this.id,
          referenceId: poll.id,
          activityType: ActivityType.Poll
        });
        this._servicesService.saveActivity(activity)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(x => this.activities.push(x));
      });
  }

  onAddQuiz(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ServiceCreateQuizComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      referenceId: this.id,
      serviceType: ServicesType.Event
    };
    const modal = this._modalService.show(ServiceCreateQuizComponent, modalSettings).content;

    modal.modelSaved
      .pipe(takeUntil(this.destroyed$))
      .subscribe(quiz => {
        this.notify.success(this.l('SavedSuccessfully'));
        const activity = new CreateServiceActivityDto({
          serviceId: this.id,
          referenceId: quiz.id,
          activityType: ActivityType.Quiz
        });
        this._servicesService.saveActivity(activity)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(x => this.activities.push(x));
      });
  }

  private initActivities(): void {
    this._servicesService.getActivities(this.id)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingInitialData$.next(false)))
      .subscribe(x => this.activities = x);
  }
}
