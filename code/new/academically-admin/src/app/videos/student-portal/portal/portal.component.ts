import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.less']
})
export class PortalComponent implements OnInit {
  videoId: string;

  constructor(
    route: ActivatedRoute,
  ) {
    route.parent.parent.parent.paramMap.subscribe(paramMap => {
      this.videoId = paramMap.get('video-id');
    });
  }

  ngOnInit(): void {
  }

}
