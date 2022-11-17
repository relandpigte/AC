
import { Component, Injector, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
    selector: 'app-community-post-card',
    templateUrl: './community-post.component.html',
    styleUrls: ['./community-post.component.scss']
})
export class CommunityPostCardComponent extends AppComponentBase implements OnInit, OnChanges {

    @Input() data: any;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

}
