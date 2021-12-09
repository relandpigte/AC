import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.less']
})
export class StarRatingComponent implements OnInit {
  @Input() totalRating = 5;
  @Input() readonly = true;
  @Output() ratingUpdated = new EventEmitter<number>();

  ratings = [];
  fractionRating: number;
  private _actualRating: number;

  constructor() {
  }

  get actualRating(): number {
    return this._actualRating;
  }

  @Input() set actualRating(value: number) {
    this._actualRating = value;
    if (this._actualRating) {
      this.ratings = new Array(Math.floor(this._actualRating));
      this.fractionRating = this._actualRating % 1;
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

  ngOnInit(): void {
  }

  onStarClick(rating: number) {
    if (!this.readonly) {
      // this.actualRating = rating;
      this.ratingUpdated.emit(rating);
    }
  }

}
