import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateEventPresenterDto, EventPresenterType, EventsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-invite-presenter-by-email',
  templateUrl: './invite-presenter-by-email.component.html',
  styleUrls: ['./invite-presenter-by-email.component.less']
})
export class InvitePresenterByEmailComponent extends AppComponentBase implements OnInit {
  @Input() workshopId: string;
  @Output() presenterInvited = new EventEmitter();

  loading = false;
  email: string;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _workshopsService: EventsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onFormSubmit(): void {
    this.loading = true;
    this._workshopsService.invitePresenter(new CreateEventPresenterDto({
      eventId: this.workshopId,
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
