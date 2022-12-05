import { Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { AppComponentBase } from '@shared/app-component-base';

@Component({
    selector: 'app-pill-picker',
    templateUrl: './pill-picker.component.html',
    styleUrls: ['./pill-picker.component.scss']
})
export class PillPickerComponent extends AppComponentBase implements OnInit, OnDestroy {
    @ViewChild('keywordEl') keywordInput: ElementRef<HTMLElement>;

    @Input() choices: any;
    @Input() maxSelected: number;

    @Input() keywordPrefix: string;
    @Input() keywordPlaceholder: string;

    @Input() autocompleteTemplateRef: any;
    @Input() autocompleteNoDataText: string;

    @Input() isLoading: boolean;

    @Output() onUpdateModel = new EventEmitter<any>();
    @Output() onKeywordUpdate = new EventEmitter<any>();

    keyword: string;
    selected: { id: string, name: string }[] = [];
    newSelected: { id: string, name: string }[] = [];

    isShowKeywordPrefix: boolean;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    get canAddItems(): boolean { return this.selected.length < this.maxSelected; }

    ngOnInit(): void {
    }

    handleKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            e.preventDefault();
            const choiceIdx = this.choices.findIndex(c => c.name.toLowerCase() === this.keyword.toLowerCase().trim());
            if (choiceIdx < 0) {
                const idx = this.selected.findIndex(e => e.name.toLowerCase() === this.keyword.toLowerCase().trim());
                if (idx < 0) {
                  this.selected.push({ id: null, name: this.keyword.trim() });
                  this.newSelected.push({ id: null, name: this.keyword.trim() });
                }
            } else {
                this.selected.push(this.choices[choiceIdx]);
            }
            this.keyword = undefined;
            this.onUpdateModel.emit(
                {
                    selected: this.selected,
                    newSelected: this.newSelected
                }
            );
        }
    }

    handleKeywordChange(keyword: string): void {
        this.onKeywordUpdate.emit(keyword);
    }

    handleChoiceSelect(choice: any): void {
        this.selected.push(choice);
        this.keyword = undefined;
        this.onUpdateModel.emit(
            {
                selected: this.selected,
                newSelected: this.newSelected
            }
        );
    }

    handleRemoveSelected(item: any): void {
        const idx = this.selected.findIndex(e => e.name === item.name);
        const newIdx = this.newSelected.findIndex(e => e.name === item.name);
        if (idx >= 0) this.selected.splice(idx, 1);
        if (newIdx >= 0) this.newSelected.splice(newIdx, 1);
        this.onUpdateModel.emit(
            {
                selected: this.selected,
                newSelected: this.newSelected
            }
        );
    }
}
