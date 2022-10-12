import { Component, Injector, OnInit } from '@angular/core';
import { WorkshopService } from '@app/dashboard/events/_services/workshop.service';
import { AutoSaveComponentBase } from '@shared/auto-save-component-base';
import { WorkshopDto, WorkshopsServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-audience',
  templateUrl: './audience.component.html',
  styleUrls: ['./audience.component.less']
})
export class AudienceComponent extends AutoSaveComponentBase implements OnInit {
  id: string;
  model = new WorkshopDto();
  constructor(
    injector: Injector,
     private _workshopService: WorkshopService,
     private _workshopServiceProxy: WorkshopsServiceProxy
    ) {
      super(injector);
     }
  ngOnInit(): void {
    this._workshopService.workshopCreated$
    .pipe(takeUntil(this.destroyed$))
    .subscribe(response => {
      if (response && response.id && !this.id && this.id !== response.id) {
        this.model = response;
      }
    });
  }

  onSettingChange(): void{
    this._workshopServiceProxy.updateSettings(this.model).subscribe((res) => {
    });
  }

}
