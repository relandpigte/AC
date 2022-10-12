import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventType, WorkshopType } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EventsTemplate } from '../../_models/events-template';

@Component({
  selector: 'app-choose-template',
  templateUrl: './choose-template.component.html',
  styleUrls: ['./choose-template.component.less']
})
export class ChooseTemplateComponent implements OnInit {
  @Input() type: string;
  @Output() selectTemplate = new EventEmitter<EventsTemplate>();
  templates: EventsTemplate[] = [];

  constructor(
    private _modal: BsModalRef,
  ) {}

  ngOnInit(): void {
    const singleEventTemplate = new EventsTemplate();
    singleEventTemplate.type = EventType.SingleEvent;
    singleEventTemplate.name = `Single${ this.type }`;
    singleEventTemplate.description = `Single${ this.type }Description`;
    this.templates.push(singleEventTemplate);

    const eventSeriesTemplate = new EventsTemplate();
    eventSeriesTemplate.type = EventType.EventSeries;
    eventSeriesTemplate.name = `${ this.type }Series`;
    eventSeriesTemplate.description = `${ this.type }SeriesDescription`;
    this.templates.push(eventSeriesTemplate);
  }

  onTemplateSelect(template: EventsTemplate): void {
    this.selectTemplate.emit(template);
    this._modal.hide();
  }

  onCloseClick(): void {
    this._modal.hide();
  }
}
