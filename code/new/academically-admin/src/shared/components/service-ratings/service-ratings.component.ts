import { Component, Injector, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-star-ratings',
  templateUrl: './service-ratings.component.html',
  styleUrls: ['./service-ratings.component.less']
})
export class ServiceRatingsComponent extends AppComponentBase implements OnInit {
  @Input() totalRating = 5;
  @Input() readonly = true;
  @Input() userRating: number;

  @Output() ratingUpdated = new EventEmitter<number>();

  ratings = [];
  fractionRating: number;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initRatings();
  }

  rate(rating: number): void {
    if (!this.readonly) {
      this.ratingUpdated.emit(rating);
    }
  }

  private initRatings(): void {
    this.ratings = new Array(Math.floor(this.userRating));
    this.fractionRating = this.userRating % 1;

    if (this.fractionRating) {
      this.fractionRating = this.fractionRating * 100;
      if (this.fractionRating <= 30) {
        this.fractionRating = 30;
      } else if (this.fractionRating >= 70) {
        this.fractionRating = 70;
      }
    }
  }
}
