import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-booking-taken',
  templateUrl: './booking-taken.component.html',
  styleUrls: ['./booking-taken.component.less']
})
export class BookingTakenComponent implements OnInit {

  constructor(private _modal: BsModalRef) {}

  ngOnInit(): void {
  }

  handleClose(): void {
    this._modal.hide();
  }
}
