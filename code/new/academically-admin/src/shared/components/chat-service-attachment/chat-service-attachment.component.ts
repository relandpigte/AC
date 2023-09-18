import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceCard, ServiceCardImage, ServiceCardType } from '@shared/models/service-card.model';

@Component({
  selector: 'app-chat-service-attachment',
  templateUrl: './chat-service-attachment.component.html',
  styleUrls: ['./chat-service-attachment.component.less']
})
export class ChatServiceAttachmentComponent extends AppComponentBase implements OnInit {
    @Input() data: ServiceCard;

    @Output() onViewClick: EventEmitter<string> = new EventEmitter();

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    get type(): ServiceCardType { return this.data?.type; }
    get images(): ServiceCardImage[] { return this.data?.images; }
    get name(): string { return this.data?.name; }
    get info(): string { return this.data?.info; }
    get description(): string { return this.data?.description; }

    ngOnInit(): void {
    }

    handleViewClick(): void {
        this.onViewClick.emit(this.data.id);
    }
}
