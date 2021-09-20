import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { UserLoginInfoDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-tutor-home',
  templateUrl: './tutor-home.component.html',
  styleUrls: ['./tutor-home.component.less'],
  animations: [appModuleAnimation()],

})
export class TutorHomeComponent extends AppComponentBase implements OnInit {
  user: UserLoginInfoDto = new UserLoginInfoDto();
  greetings: string;
  constructor(
    injector: Injector,
  ) {
    super(injector);
    this.user = this.appSession.user;
  }

  ngOnInit(): void {
    this.greetings = this.getGreetings();
  }

  getGreetings(): string {
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMin = currentTime.getMinutes();

    if (currentHours >= 5 && currentHours <= 11 && currentMin <= 59) {
      return this.l('GoodMorning');
    } else if (currentHours >= 12 && currentHours <= 16 && currentMin <= 59) {
      return this.l('GoodAfternoon');
    } else if (currentHours >= 17 || (currentHours >= 0 && currentHours <= 4) && currentMin <= 59) {
      return this.l('GoodEvening');
    }
  }
}
