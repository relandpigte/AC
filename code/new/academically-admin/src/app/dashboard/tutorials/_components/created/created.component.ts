import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { VideoDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-created',
  templateUrl: './created.component.html',
  styleUrls: ['./created.component.less']
})
export class CreatedComponent extends AppComponentBase implements OnInit {
  tutorials: VideoDto[] = Array(4).fill([]).map(() => this.generateRandomTutorial()) as VideoDto[];
  isLoading = true;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
    console.log(this.tutorials);
  }
}
