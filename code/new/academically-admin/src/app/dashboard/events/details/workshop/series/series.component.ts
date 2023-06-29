import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '@app/dashboard/events/_services/event.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateEventDto, EventDto, EventsServiceProxy, EventStatus, EventType } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';
import { CreateWorkshopComponent } from '../../../_components/create-workshop/create-workshop.component';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.less'],
  animations: [appModuleAnimation()],
})
export class SeriesComponent extends AppComponentBase implements OnInit {
  parentId: string;
  model = new EventDto();

  WorkshopStatus = EventStatus;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _modalService: BsModalService,
    private _router: Router,
    private _workshopsService: EventsServiceProxy,
    private _workshopService: EventService,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('parent-id')) {
        this.parentId = paramMap.get('parent-id');
        this.getWorkshopSeries();
      }
    });
  }

  ngOnInit(): void {
    this._workshopService.eventCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id) {
          this.model = response;
        }
      });
  }

  onAddWorkshopClick(): void {
    const newWorkshop = new CreateEventDto();
    newWorkshop.type = EventType.Single;
    newWorkshop.name = '';
    newWorkshop.parentId = this.parentId;

    const modalSettings = this.defaultModalSettings as ModalOptions<CreateWorkshopComponent>;
    modalSettings.initialState = {
      model: newWorkshop,
    };
    const modal = this._modalService.show(CreateWorkshopComponent, modalSettings).content;
    modal.createWorkshop.subscribe(workshop => {
      this._workshopsService.create(workshop)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(response => {
          this.notify.success(this.l('SavedSuccessfully'));
          this._router.navigate(['app/dashboard/events/workshop/series', response.parentId, response.id]);
        });
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
            this.l('SavedSuccessfully');
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
            this.l('SavedSuccessfully');
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  private getWorkshopSeries(): void {
    this._workshopsService.get(this.parentId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._workshopService.eventCreated = response;
      });
  }
}
