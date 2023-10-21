import { Component, OnInit, Injector } from '@angular/core';
import { EventPollDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { PortalPollService } from '../../_services/portal-poll.service';

@Component({
  selector: 'app-polls-attendee-closed',
  templateUrl: './polls-attendee-closed.component.html',
  styleUrls: ['./polls-attendee-closed.component.less']
})
export class PollsAttendeeClosedComponent extends AppComponentBase implements OnInit {
  polls: EventPollDto[] = [];
  poll: EventPollDto;

  constructor(
    injector: Injector,
    private _portalPollService: PortalPollService,
  ) {
    super(injector);
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
