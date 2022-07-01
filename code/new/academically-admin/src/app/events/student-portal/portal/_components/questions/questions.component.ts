import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PortalService } from '../../_services/portal.service';
import { takeUntil } from 'rxjs/operators';
import { EventDto } from '@shared/service-proxies/service-proxies';
import { CustomAction } from '@app/_shared/modules/questions/_model/questions.model';

@Component({
  selector: 'app-sidebar-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.less']
})
export class QuestionsComponent extends AppComponentBase implements OnInit {
  @Input() referenceId: string;

  event: EventDto;
  attendeeIds: number[] = [];

  customReactionActions: CustomAction[] = [];
  customActions: CustomAction[] = [];

  constructor(
    injector: Injector,
    private _portalService: PortalService
  ) {
    super(injector);

    this.initCustomActions();
  }

  get userId(): number { return this.appSession.userId; }
  get hostId(): number { return this.event?.creatorUserId; }
  get isHost(): boolean { return this.event?.creatorUserId === this.userId; }

  ngOnInit(): void {
    this._portalService.event$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(event => {
        this.event = event;
        this.referenceId = event.id;
      });

    this._portalService.attendees$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(attendees => {
        this.attendeeIds = attendees.filter(a => a.user).map(a => a.user.id);
      });
  }

  initCustomActions(): void {
    this.customReactionActions = [
      { label: 'Upvote', class: 'btn-outline-secondary', action: (question) => { console.log(question); } }
    ];

    this.customActions = [
      { label: 'AnswerLive', class: 'btn-outline-primary', action: (question) => { console.log(question); } }
    ];
  }
}
