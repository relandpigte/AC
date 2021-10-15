import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { UserLoginInfoDto } from '@shared/service-proxies/service-proxies';
import { OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CourseWizardComponent } from './../home/courses/course-wizard/course-wizard.component';
import { ModalOptions } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  templateUrl: './home.component.html',
  animations: [appModuleAnimation()],
})
export class HomeComponent extends AppComponentBase implements OnInit {
  user: UserLoginInfoDto = new UserLoginInfoDto();
  greetings: string;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _router: Router,
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

  onCreateClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CourseWizardComponent>;
    this._modalService.show(CourseWizardComponent, modalSettings).content;
  }
}
