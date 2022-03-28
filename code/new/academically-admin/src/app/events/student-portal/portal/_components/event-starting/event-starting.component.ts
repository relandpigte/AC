import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-event-starting',
  templateUrl: './event-starting.component.html',
  styleUrls: ['./event-starting.component.less']
})
export class EventStartingComponent implements OnInit, OnDestroy {
  @Output() eventStarted = new EventEmitter<boolean>();

  timer = 5;
  timerSubscription: Subscription;

  constructor(
    private _modalRef: BsModalRef,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.timerSubscription = interval(1000).subscribe(() => {
        if (this.timer > 1) {
          this.timer--;
        } else {
          setTimeout(() => {
            this.eventStarted.emit(true);
            this._modalRef.hide();
          }, 500);
          this.timer = 0;
          this.timerSubscription.unsubscribe();
        }
      });
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  onCloseClick(): void {
    this.eventStarted.emit(false);
    this._modalRef.hide();
  }
}
