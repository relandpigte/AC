import { Component, OnInit , Input, Injector} from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { StudentVideoDto, VideoType } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent extends AppComponentBase implements OnInit {

  @Input() models: StudentVideoDto[] = [];
  VideoType = VideoType;
  constructor(injector : Injector, private router: Router) {
    super(injector);
   }

  ngOnInit(): void {
  }

  navToUrl(url , id) {
    this.router.navigate([url , id]);
  }

}
