import { Component, Injector, OnInit } from '@angular/core';
import { CoachingService } from '@app/dashboard/coaching/_services/coaching.service';
import { AutoSaveComponentBase } from '@shared/auto-save-component-base';
import { CoachingDto, CoachingsServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-guests',
  templateUrl: './guests.component.html',
  styleUrls: ['./guests.component.less']
})
export class GuestsComponent extends AutoSaveComponentBase implements OnInit {

  id: string;
  model = new CoachingDto();
  constructor(
    injector: Injector,
     private _coachingService: CoachingService,
     private _coachingServiceProxy: CoachingsServiceProxy
    ) {
      super(injector);
     }

  ngOnInit(): void {
    this._coachingService.coachingCreated$
    .pipe(takeUntil(this.destroyed$))
    .subscribe(response => {
      if (response && response.id && !this.id && this.id !== response.id) {
        this.model = response;
      }
    });
  }

  onSettingChange(): void{
    this._coachingServiceProxy.updateSettings(this.model).subscribe((res) => {
    });
  }
}
