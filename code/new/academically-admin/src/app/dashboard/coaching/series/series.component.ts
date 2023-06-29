import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateCoachingDto, CoachingDto, CoachingsServiceProxy, CoachingType, CoachingStatus } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';
import { CreateCoachingComponent } from '../_components/create-coaching/create-coaching.component';
import { CoachingService } from '../_services/coaching.service';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { finalize } from '@node_modules/rxjs/operators';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.less'],
  animations: [appModuleAnimation()],
})
export class SeriesComponent extends AppComponentBase implements OnInit {
  parentId: string;
  model = new CoachingDto();

  CoachingStatus = CoachingStatus;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _modalService: BsModalService,
    private _router: Router,
    private _coachingsService: CoachingsServiceProxy,
    private _coachingService: CoachingService,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('parent-id')) {
        this.parentId = paramMap.get('parent-id');
        this.getCoachingSeries();
      }
    });
  }

  ngOnInit(): void {
    this._coachingService.coachingCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id) {
          this.model = response;
        }
      });
  }

  onAddCoachingClick(): void {
    const newCoaching = new CreateCoachingDto();
    newCoaching.type = CoachingType.Single;
    newCoaching.name = '';
    newCoaching.parentId = this.parentId;

    const modalSettings = this.defaultModalSettings as ModalOptions<CreateCoachingComponent>;
    modalSettings.initialState = {
      model: newCoaching,
    };
    const modal = this._modalService.show(CreateCoachingComponent, modalSettings).content;
    modal.createCoaching.subscribe(coaching => {
      this._coachingsService.create(coaching)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(response => {
          this.notify.success(this.l('SavedSuccessfully'));
          this._router.navigate(['app/dashboard/coaching/series', response.parentId, response.id]);
        });
    });
  }

  onPublishClick(): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('PublishCoachingConfirmationMessage'),
      confirmCb: async (): Promise<void> => {
        await this._coachingsService.updateStatus(this.model.id, CoachingStatus.Published)
          .pipe(takeUntil(this.destroyed$), finalize(() => {
            this.model.status = CoachingStatus.Published;
            this.l('SavedSuccessfully');
          }))
          .toPromise();
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  onUnpublishClick(): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('UnpublishCoachingConfirmationMessage'),
      confirmCb: (): void => {
        this._coachingsService.updateStatus(this.model.id, CoachingStatus.Draft)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.model.status = CoachingStatus.Draft;
            this.l('SavedSuccessfully');
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  private getCoachingSeries(): void {
    this._coachingsService.get(this.parentId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._coachingService.coachingCreated = response;
      });
  }
}
