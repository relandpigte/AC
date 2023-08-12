import { Component, OnInit } from '@angular/core';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';

@Component({
  selector: 'app-about-learn',
  templateUrl: './about-learn.component.html',
  styleUrls: ['./about-learn.component.less']
})
export class AboutLearnComponent implements OnInit {

  shimmerType = ShimmerType;

  constructor() { }

  ngOnInit(): void {
  }

}
