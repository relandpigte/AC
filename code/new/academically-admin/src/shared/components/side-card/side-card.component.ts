import { AfterViewInit, Component, EventEmitter, Injector, Input, Output, Renderer2 } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
    selector: 'app-community-side-card',
    templateUrl: './side-card.component.html',
    styleUrls: ['./side-card.component.less'],
    animations: [appModuleAnimation()]
})
export class CommunitySideCardComponent extends AppComponentBase implements AfterViewInit {

    @Input() header: string;
    @Input() items: any[] = [];
    @Input() template: any;

    @Output() onClickItem: EventEmitter<any> = new EventEmitter();
    @Output() onViewAll: EventEmitter<any> = new EventEmitter();

    constructor(
        injector: Injector,
        private _renderer: Renderer2
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
    }

    handleItemClick(row: any): void {
        this.onClickItem.emit(row);
    }

    handleViewAllClick(): void {
        this.onViewAll.emit();
    }
}
