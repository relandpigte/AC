import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { EventPresenterDto, EventPresenterType, EventsServiceProxy, UpdatePresenterTypeDto } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { InvitePresenterComponent } from './_components/invite-presenter/invite-presenter.component';

@Component({
  selector: 'app-studio',
  templateUrl: './studio.component.html',
  styleUrls: ['./studio.component.less']
})
export class StudioComponent extends AppComponentBase implements OnInit {
  presenters: EventPresenterDto[] = [];
  workshopId: string;
  activeTab = 1;
  loading = false;
  WorkshopPresenterType = EventPresenterType;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _modalService: BsModalService,
    private _workshopsService: EventsServiceProxy,
  ) {
    super(injector);
    route.parent.parent.paramMap
      .pipe(takeUntil(this.destroyed$))
      .subscribe(paramMap => {
        if (paramMap.has('id')) {
          this.workshopId = paramMap.get('id');
          this.getPresenters();
        }
      });
  }

  ngOnInit(): void {
  }

  changeActiveTab(value: number) {
    this.activeTab = value;
  }

  onInviteClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<InvitePresenterComponent>;
    modalSettings.initialState = {
      workshopId: this.workshopId,
    };
    const modal = this._modalService.show(InvitePresenterComponent, modalSettings).content;
    modal.presenterInvited.subscribe(() => {
      this.getPresenters();
    });
  }

  onPresenterTypeChange(type: EventPresenterType, presenter: EventPresenterDto): void {
    if (presenter.type !== type) {
      this.loading = true;
      this._workshopsService.updatePresenterType(new UpdatePresenterTypeDto({
        id: presenter.id,
        newType: type,
      }))
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.loading = false;
          }),
        )
        .subscribe(() => {
          this.notify.success(this.l('SavedSuccessfully'));
          this.getPresenters();
        });
    }
  }

  onRemovePresenterClick(presenter: EventPresenterDto): void {
    this.loading = true;
    this._workshopsService.removePresenter(presenter.id)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe(() => {
        this.notify.success(this.l('SavedRemoved'));
        this.getPresenters();
      });
  }

  private getPresenters(): void {
    this.loading = true;
    this._workshopsService.getAllPresenters(this.workshopId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe(responses => {
        this.presenters = responses;
      });
  }
}
