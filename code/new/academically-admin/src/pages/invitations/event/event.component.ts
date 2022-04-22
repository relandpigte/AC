import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { EventPresenterStatus, EventsServiceProxy, UpdateEventPresenterStatusDto } from '@shared/service-proxies/service-proxies';
import { EMPTY, of, throwError } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.less']
})
export class EventComponent extends AppComponentBase implements OnInit {
  id: string;
  status: EventPresenterStatus;
  loading = true;
  success = false;
  errorCode: number;

  EventPresenterStatus = EventPresenterStatus;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _eventsService: EventsServiceProxy,
  ) {
    super(injector);
    route.paramMap
      .pipe(takeUntil(this.destroyed$))
      .subscribe(paramMap => {
        if (paramMap.has('id')) {
          this.id = paramMap.get('id');
        }
      });
    route.queryParamMap
      .pipe(takeUntil(this.destroyed$))
      .subscribe(paramMap => {
        if (paramMap.has('status')) {
          this.status = +paramMap.get('status');
        }
      });
  }

  ngOnInit(): void {
    this._eventsService.updatePresenterStatus(new UpdateEventPresenterStatusDto({
      id: this.id,
      status: this.status,
    }))
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.loading = false;
        }),
        catchError((err) => {
          this.success = false;
          return throwError(err);
        })
      ).subscribe(() => {
        this.success = true;
      });
  }
}
