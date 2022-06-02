import { Component, OnInit, Injector } from '@angular/core';
import { StudentEventDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { PortalService } from '@app/events/student-portal/portal/_services/portal.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-speak-requests',
  templateUrl: './speak-requests.component.html',
  styleUrls: ['./speak-requests.component.less']
})
export class SpeakRequestsComponent extends AppComponentBase implements OnInit {
  speakRequesters: StudentEventDto[] = [];

  constructor(
    injector: Injector,
    private _portalService: PortalService,
  ) {
    super(injector);
    this._portalService.speakRequest$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          this.speakRequesters.push(response);
        }
      });
  }

  ngOnInit(): void {

  }

  onGrantClick(speakRequester: StudentEventDto): void {
    this._portalService.grantRequestToSpeak = speakRequester;
    const index = this.speakRequesters.findIndex(e => e.id === speakRequester.id);
    this.speakRequesters.splice(index, 1);
  }

  onDeclineClick(speakRequester: StudentEventDto): void {
    this._portalService.declineRequestToSpeak = speakRequester;
    const index = this.speakRequesters.findIndex(e => e.id === speakRequester.id);
    this.speakRequesters.splice(index, 1);
  }
}
