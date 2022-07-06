import { Component, OnInit, Injector } from '@angular/core';
import { EventPollDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { PortalPollService } from '../../_services/portal-poll.service';

@Component({
  selector: 'app-polls-closed',
  templateUrl: './polls-closed.component.html',
  styleUrls: ['./polls-closed.component.less']
})
export class PollsClosedComponent extends AppComponentBase implements OnInit {
  polls: EventPollDto[] = [];
  poll: EventPollDto;

  constructor(
    injector: Injector,
    private _portalPollService: PortalPollService,
  ) {
    super(injector);
    this.pipeDestroy(this._portalPollService.pollClosed$, (response) => {
      if (response) {
        this.polls.push(response);
      }
    });
  }

  ngOnInit(): void {
  }

  onBackClick(): void {
    this.poll = undefined;
  }

  onViewResultsClick(poll: EventPollDto): void {
    this.poll = poll;
  }
}
