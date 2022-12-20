import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Injector, Input, Output, Renderer2 } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';


@Component({
    selector: 'app-emoji-picker',
    templateUrl: './emoji-picker.component.html',
    styleUrls: ['./emoji-picker.component.scss'],
    animations: [appModuleAnimation()]
})
export class EmojiPickerComponent extends AppComponentBase implements AfterViewInit {
    @Input() input: any;

    @Output() onBack = new EventEmitter<any>();
    @Output() onClose = new EventEmitter<any>();
    @Output() onSelect = new EventEmitter<any>();

    constructor(
        injector: Injector,
        private _elRef: ElementRef,
        private _renderer: Renderer2
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this.positionPicker();
    }

    @HostListener('document:click', ['$event.target'])
    onFocusOut(element): void {
        if (!this.input.contains(element) && !this._elRef.nativeElement.contains(element)) {
            this.handleOnClose();
        }
    }

    handleOnClose(): void {
        this.onClose.emit();
    }

    handleOnBack(): void {
        this.onBack.emit();
    }

    handleEmojiSelect(emoji: any): void {
        this.onSelect.emit(emoji);
    }

    private positionPicker(): void {
        if (this.input) {
            const dimension = this.input.getBoundingClientRect();
            this._renderer.setStyle(this._elRef.nativeElement, 'top', `${this.input.offsetTop + this.input.offsetHeight}px`);
            this._renderer.setStyle(this._elRef.nativeElement, 'left', `${this.input.offsetLeft}px`);
        }
    }
}
