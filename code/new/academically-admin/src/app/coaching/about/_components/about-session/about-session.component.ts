import { Component, OnInit } from '@angular/core';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';

@Component({
  selector: 'app-about-session',
  templateUrl: './about-session.component.html',
  styleUrls: ['./about-session.component.less']
})
export class AboutSessionComponent implements OnInit {

  shimmerType = ShimmerType;

  constructor() { }

  ngOnInit(): void {
  }

}
