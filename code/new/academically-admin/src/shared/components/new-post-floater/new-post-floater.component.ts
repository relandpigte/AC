import { AfterViewInit, Component, ElementRef, HostListener, Injector, Input, OnInit, Renderer2 } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { PostsStateService } from '@shared/services/posts-state.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-new-post-floater',
    templateUrl: './new-post-floater.component.html',
    styleUrls: ['./new-post-floater.component.less'],
    animations: [appModuleAnimation()]
})
export class NewPostFloaterComponent extends AppComponentBase implements OnInit, AfterViewInit {
    @Input() parentContainer: any;

    postsStateService: PostsStateService;

    isShown = false;

    constructor(
        injector: Injector,
        private _elRef: ElementRef,
        private _renderer: Renderer2
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.postsStateService = this.pubSubService.getStateService<PostsStateService>('posts');
        this.postsStateService.newPosts$
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
                this.isShown = !!this.postsStateService.newPosts?.size;
                this.repositionFloater();
            });
    }

    ngAfterViewInit(): void {
        this.listenToScrolls();
    }

    private listenToScrolls(): void {
        const container = document.querySelector('.main-content.can-scroll');
        if (container) {
            container.addEventListener('scroll', () => this.repositionFloater());
        }
    }

    private repositionFloater(): void {
        if (!this.isShown) return;
        const dimensions = this.parentContainer.getBoundingClientRect();
        const floaterContainer = this._elRef.nativeElement.querySelector('.floater-container');
        if (!floaterContainer) return;
        this._renderer.setStyle(floaterContainer, 'transform', `translate(-50%, calc((30px + ${dimensions.y < 88 ? 88 - dimensions.y : 0}px) - 50%))`);
    }

    handleClick(): void {
        this.isShown = false;
        this.postsStateService.mergeNewPosts();
        this.parentContainer.scrollIntoView({ behavior: 'smooth' });
    }
}
