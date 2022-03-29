import { Component, Injector, OnInit } from '@angular/core';
import { EventService } from '@app/events/_services/event.service';
import { AutoSaveComponentBase } from '@shared/auto-save-component-base';
import { EventDto, EventsServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-audience',
  templateUrl: './audience.component.html',
  styleUrls: ['./audience.component.less']
})
export class AudienceComponent extends AutoSaveComponentBase implements OnInit {
  id: string;
  model = new EventDto();
  constructor(
    injector: Injector,
     private _eventService: EventService,
     private _eventServiceProxy: EventsServiceProxy
    ) {
      super(injector);
     }
  ngOnInit(): void {
    this._eventService.eventCreated$
    .pipe(takeUntil(this.destroyed$))
    .subscribe(response => {
      if (response && response.id && !this.id && this.id !== response.id) {
        this.model = response;
      }
    });
  }

  onSettingChange(): void{
    this._eventServiceProxy.updateSettings(this.model).subscribe((res) => {
    });
  }

}
