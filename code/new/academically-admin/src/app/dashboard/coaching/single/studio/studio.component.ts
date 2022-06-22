import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { InvitePresenterComponent } from './_components/invite-presenter/invite-presenter.component';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, finalize } from 'rxjs/operators';
import { CoachingPresenterDto, CoachingsServiceProxy, CoachingPresenterType, UpdateCoachingPresenterTypeDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-studio',
  templateUrl: './studio.component.html',
  styleUrls: ['./studio.component.less']
})
export class StudioComponent extends AppComponentBase implements OnInit {
  presenters: CoachingPresenterDto[] = [];
  coachingId: string;
  activeTab = 1;
  loading = false;
  CoachingPresenterType = CoachingPresenterType;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _modalService: BsModalService,
    private _coachingsService: CoachingsServiceProxy,
  ) {
    super(injector);
    route.parent.parent.paramMap
      .pipe(takeUntil(this.destroyed$))
      .subscribe(paramMap => {
        if (paramMap.has('id')) {
          this.coachingId = paramMap.get('id');
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
      coachingId: this.coachingId,
    };
    const modal = this._modalService.show(InvitePresenterComponent, modalSettings).content;
    modal.presenterInvited.subscribe(() => {
      this.getPresenters();
    });
  }

  onPresenterTypeChange(type: CoachingPresenterType, presenter: CoachingPresenterDto): void {
    if (presenter.type !== type) {
      this.loading = true;
      this._coachingsService.updatePresenterType(new UpdateCoachingPresenterTypeDto({
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

  onRemovePresenterClick(presenter: CoachingPresenterDto): void {
    this.loading = true;
    this._coachingsService.removePresenter(presenter.id)
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
    this._coachingsService.getAllPresenters(this.coachingId)
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
