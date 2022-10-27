import { Component, EventEmitter, Injector, Input, Output, OnChanges, SimpleChanges } from "@angular/core";
import { AppComponentBase } from '@shared/app-component-base';

import * as _ from 'lodash';

@Component({
    selector: 'app-carousel-pill',
    templateUrl: './carousel-pill.component.html',
    styleUrls: ['./carousel-pill.component.less']
})
export class CarouselPillComponent extends AppComponentBase implements OnChanges {

    @Input() choices: any[];
    @Input() key: string;

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

    ngOnChanges(changes: SimpleChanges): void {
        if ('choices' in changes && !_.isEqual(changes.choices.previousValue, changes.choices.currentValue)) {
            this.handleSelectAll();
        }
    }

    isPillSelected(i: string): boolean { return this.selected.includes(i); }
    isAllPillSelected(): boolean { return !this.selected.length; }
    getDisplayValue(choice: any): string { return this.key ? _.get(choice, this.key) : choice; }

    handleAddPill(): void {
        this.onAdd.emit();
    }

    handleSelectAll(): void {
        this.selected = [];
        this.onSelect.emit(this.choices);
    }

    handleSelectPill(i: string): void {
        if (this.selected.includes(i)) this.selected = _.remove(this.selected, x => x != i);
        else this.selected.push(i);
        this.selected = _.uniq(this.selected);
        this.onSelect.emit(this.selected.length ? this.selected : this.choices);
    }
}
