import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { AppComponentBase } from '@shared/app-component-base';

import * as _ from 'lodash';

@Component({
    selector: 'app-carousel-pill',
    templateUrl: './carousel-pill.component.html',
    styleUrls: ['./carousel-pill.component.less']
})
export class CarouselPillComponent extends AppComponentBase implements OnInit, OnChanges {

    @Input() choices: string[];

    @Input() showAll: boolean = true;
    @Input() canAdd: boolean = true;

    @Output() onSelect = new EventEmitter<string[]>();
    @Output() onAdd =  new EventEmitter<void>();

    private selected: string[] = [];

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges): void {
        if ('choices' in changes && !_.isEqual(changes.choices.previousValue, changes.choices.currentValue)) {
            this.selected = _.uniq(this.choices);
            this.onSelect.emit(this.selected);
        }
    }

    isPillSelected(i: string): boolean { return this.selected.includes(i); }
    isAllPillsSelected(): boolean { return this.choices.every(c => this.selected.some(s => s === c)); }

    handleAddPill(): void {
        this.onAdd.emit();
    }

    handleSelectAll(): void {
        this.selected = _.uniq(this.choices);
        this.onSelect.emit(this.selected);
    }

    handleSelectPill(i: string): void {
        if (this.selected.includes(i)) this.selected = _.remove(this.selected, x => x != i);
        else this.selected.push(i);

        this.selected = _.uniq(this.selected);
        this.onSelect.emit(this.selected);
    }
}
