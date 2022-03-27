import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { EventDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent extends AppComponentBase implements OnInit {
  @Input() events: EventDto[] = [];

  @Output() visitEvent = new EventEmitter<EventDto>();

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onVisitEventClick(event: EventDto): void {
    this.visitEvent.emit(event);
  }
}
