import { Component, Injector, Renderer2, Output, EventEmitter, Input } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '../../enums/shimmer/shimmer-type.enum';

@Component({
    selector: 'app-community-composer',
    templateUrl: './composer.component.html',
    styleUrls: ['./composer.component.less'],
    animations: [appModuleAnimation()]
})
export class CommunityComposerComponent extends AppComponentBase {
    @Input() showBottomActions = true;
    @Input() isLoading: boolean;
    @Input() placeholder: string = 'Community.Composer.Placeholder';

    @Output() onQuickPostClick: EventEmitter<any> = new EventEmitter();
    @Output() onQuestionClick: EventEmitter<any> = new EventEmitter();
    @Output() onDiscussionClick: EventEmitter<any> = new EventEmitter();

    textAreaRows = 1;

    constructor(
        injector: Injector,
        private _renderer: Renderer2
    ) {
        super(injector);
    }

    get shimmerType() { return ShimmerType; }
}
