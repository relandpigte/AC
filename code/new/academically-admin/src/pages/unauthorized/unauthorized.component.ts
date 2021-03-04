import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.less']
})
export class UnauthorizedComponent implements OnInit {

  constructor(
    private _location: Location
  ) { }

  ngOnInit(): void {
  }

  onGoBackClick(): void {
    this._location.back();
  }
}
