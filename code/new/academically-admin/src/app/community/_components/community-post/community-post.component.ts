
import { Component, Injector, OnInit, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PostDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'app-community-post-card',
    templateUrl: './community-post.component.html',
    styleUrls: ['./community-post.component.scss']
})
export class CommunityPostCardComponent extends AppComponentBase implements OnInit {

    @Input() post: PostDto;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit(): void {
    }

}
