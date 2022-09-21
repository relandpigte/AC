import { AppComponentBase } from '@shared/app-component-base';
import { Component, Input, OnInit, Injector, ElementRef, ViewChild, Renderer2, AfterViewInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel-wrapper.component.html',
  styleUrls: ['./carousel-wrapper.component.scss']
})
export class CarouselWrapperComponent extends AppComponentBase implements OnInit, AfterViewInit {

  @Input() items: any[] = [];
  @Input() circular: boolean = false;
  @Input() autoplayInterval: number = 0;
  @Input() numScroll: number = 1;
  @Input() visibleItems: number = 3;
  @Input() isInfiteScroll: boolean = false;

  @Output() requestNewData: EventEmitter<boolean> = new EventEmitter();

  leftNav: HTMLElement;
  rightNav: HTMLElement;

  pages: number = 0;

  responsiveOptions: any = [
    {
        breakpoint: '1215px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '1191px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '995px',
        numVisible: 1,
        numScroll: 1
    },
];

  constructor(
    injector: Injector,
    private _renderer: Renderer2,
    private _elRef : ElementRef
    ) {
    super(injector);
  }

  ngAfterViewInit(): void {
    this.leftNav = (<HTMLElement>this._elRef.nativeElement).querySelector('.p-ripple.p-carousel-prev.p-link');
    this.rightNav = (<HTMLElement>this._elRef.nativeElement).querySelector('.p-ripple.p-carousel-next.p-link');
    this._renderer.setStyle(this.leftNav, 'visibility', 'hidden');

  }

  ngOnInit() {
    this.pages = this.items.length - this.visibleItems;
  }

  onPage(event: any): void {
    if (this.isLastPage(event.page)) {
      if (this.isInfiteScroll == true) {
        this.requestNewData.emit(true);
        // this._renderer.setAttribute(this.rightNav, 'disabled', 'false');
        this._renderer.removeAttribute(this.rightNav, 'disabled');
        this._renderer.removeClass(this.rightNav, 'p-disabled');
      } else {
        this._renderer.setStyle(this.rightNav, 'visibility', 'hidden');
        this._renderer.setStyle(this.leftNav, 'visibility', 'visible');
      }
    } else if (this.isFirstPage(event.page)) {
      this._renderer.setStyle(this.rightNav, 'visibility', 'visible');
      this._renderer.setStyle(this.leftNav, 'visibility', 'hidden');
    } else {
      this._renderer.setStyle(this.rightNav, 'visibility', 'visible');
      this._renderer.setStyle(this.leftNav, 'visibility', 'visible');
    }
  }

  private isFirstPage(page: number): boolean {
    return page == 0;
  }

  private isLastPage(page: number): boolean {
    return this.pages == page;
  }
}
