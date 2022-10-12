import { Component, OnInit, Injector, Input, EventEmitter, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EventsServiceProxy, CreateEventPresenterDto, EventPresenterType } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-invite-presenter-by-email',
  templateUrl: './invite-presenter-by-email.component.html',
  styleUrls: ['./invite-presenter-by-email.component.less']
})
export class InvitePresenterByEmailComponent extends AppComponentBase implements OnInit {
  @Input() eventId: string;
  @Output() presenterInvited = new EventEmitter();

  loading = false;
  email: string;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _eventsService: EventsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onFormSubmit(): void {
    this.loading = true;
    this._eventsService.invitePresenter(new CreateEventPresenterDto({
      eventId: this.eventId,
      type: EventPresenterType.Guest,
      email: this.email,
    }))
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.presenterInvited.emit();
        this._modal.hide();
      });
  }

  onCloseClick(): void {
    this._modal.hide();
  }
}
