import { AfterViewInit, Component, ElementRef, HostListener, Injector, Renderer2, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
    selector: 'app-community-composer',
    templateUrl: './composer.component.html',
    styleUrls: ['./composer.component.less'],
    animations: [appModuleAnimation()]
})
export class CommunityComposerComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('input', { static: true }) input: ElementRef;

    textAreaRows = 1;

    constructor(
        injector: Injector,
        private _renderer: Renderer2
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        if (this.input) {
            this._renderer.listen(this.input.nativeElement, 'input', () => this.adjustTextareaRows());
            this.adjustTextareaRows();
        }
    }

    @HostListener ('window:resize')
    onWindowResize(): void {
        this.adjustTextareaRows();
    }

    adjustTextareaRows(): void {
        this.textAreaRows = 1;
        if (this.input.nativeElement.value.split(/\r*\n/).length > 1) this.textAreaRows = 8;
    }
}
