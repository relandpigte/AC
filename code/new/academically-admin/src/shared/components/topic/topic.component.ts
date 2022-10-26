import { Component, Injector, Input } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ShortNumPipe } from '@shared/pipes/short-num.pipe';

@Component({
    selector: 'app-topic-card',
    templateUrl: './topic.component.html',
    styleUrls: ['./topic.component.scss'],
    animations: [appModuleAnimation()],
    providers: [ ShortNumPipe ]
})
export class TopicCardComponent extends AppComponentBase {

    @Input() data: any;
    @Input() customClass = '';
    @Input() showRemove = false;
    @Input() isLoading = true;

    get isParent(): boolean { return this.data?.children?.length; }
    get name(): string { return this.data?.name; }
    get composition(): string { return this._snPipe.transform(this.data?.children?.length ?? 4323, 1); }
    get followers(): string { return this._snPipe.transform(this.data?.followers?.length ?? 8362, 1); }

    constructor(
        injector: Injector,
        private _snPipe: ShortNumPipe
    ) {
        super(injector);
    }
}
