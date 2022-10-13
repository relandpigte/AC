import { Component, OnInit, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventsServiceProxy, CreateStudentEventDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less']
})
export class LandingPageComponent extends AppComponentBase implements OnInit {
  loading = false;
  id: string;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _router: Router,
    private _eventsService: EventsServiceProxy,
  ) {
    super(injector);
    route.parent.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('event-id')) {
        this.id = paramMap.get('event-id');
      }
    });
  }

  ngOnInit(): void {
  }

  onBuyNowClick(): void {
    this.loading = true;
    const studentEvent = new CreateStudentEventDto();
    studentEvent.eventId = this.id;
    studentEvent.saveOnly = false;
    this._eventsService.purchase(studentEvent)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(() => {
        this._router.navigate([`/app/dashboard/events/portal/broadcast/student/${this.id}/portal`]);
      });
  }
}
