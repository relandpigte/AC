import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Injector, Input, OnChanges, Output, Renderer2, SimpleChanges } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel-wrapper.component.html',
  styleUrls: ['./carousel-wrapper.component.scss']
})
export class CarouselWrapperComponent extends AppComponentBase implements AfterViewInit, OnChanges {

  private MIN_ITEMS = 3;

  @Input() items: any[] = [];
  @Input() circular: boolean = false;
  @Input() autoplayInterval: number = 0;
  @Input() numScroll: number = 1;
  @Input() visibleItems: number = 3;
  @Input() isInfiteScroll: boolean = false;
  @Input() maxItems: number = 0;

  @Input() isFeatured: boolean = false;
  @Input() isLoading: boolean = false;

  @Output() onRequestNewData: EventEmitter<any> = new EventEmitter();
  @Output() onServiceCardClick: EventEmitter<any> = new EventEmitter();

  leftNav: HTMLElement;
  rightNav: HTMLElement;

  pages: number = 0;

  windowResizeInterval$: any;
  renderCarousel = true;

  constructor(
    injector: Injector,
    private _renderer: Renderer2,
    private _elRef : ElementRef
    ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes.items?.previousValue !== changes.items?.currentValue && changes.items?.currentValue.length) {
        if (this.items.length < this.MIN_ITEMS) {
          this.items.push(Array(this.MIN_ITEMS - this.items.length).fill({}));
        }
      }
  }

  ngAfterViewInit(): void {
    this.leftNav = (<HTMLElement>this._elRef.nativeElement).querySelector('.p-ripple.p-carousel-prev.p-link');
    this.rightNav = (<HTMLElement>this._elRef.nativeElement).querySelector('.p-ripple.p-carousel-next.p-link');
    if (this.leftNav) this._renderer.setStyle(this.leftNav, 'visibility', 'hidden');

    this.computeVisibleItems();
    this.showNextButton();
  }

  ngOnInit() {}

  @HostListener('window:resize')
  onWindowResize() {
    this.computeVisibleItems();
  }

  private computeVisibleItems(): void {
    if (this.windowResizeInterval$) clearTimeout(this.windowResizeInterval$);
    this.windowResizeInterval$ = setTimeout(() => {
      const serviceCard = this._elRef.nativeElement.querySelector('.service-card');
      if (serviceCard) {
        const containerWidth = this._elRef.nativeElement.getBoundingClientRect().width;
        const cardWidth = serviceCard.getBoundingClientRect().width;
        this.visibleItems = Math.floor(containerWidth / cardWidth);
      }
      this.pages = this.items.length - this.visibleItems;
      this.renderCarousel = false;
      setTimeout(() => this.renderCarousel = true, 100);
    }, 100);
  }

  onPage(event: any): void {
    if (this.isLastPage(event.page)) {
      if (this.isInfiteScroll == true) {
        this.showNextButton();
        if (this.items?.length < this.maxItems) {
          this.onRequestNewData.emit(this.items?.length);
          this.pages = this.items.length - this.visibleItems;
        }  else {
          this.hideNextButton();
        }
        this._renderer.removeAttribute(this.rightNav, 'disabled');
        this._renderer.removeClass(this.rightNav, 'p-disabled');
      } else {
        this.hideNextButton();
        this.showPrevButton();
      }
    } else if (this.isFirstPage(event.page)) {
      this.showNextButton();
      this.hidePrevButton();
    } else {
      this.showNextButton();
      this.showPrevButton();
    }
  }

  private hidePrevButton(): void {
    this._renderer.setStyle(this.leftNav, 'visibility', 'hidden');
  }

  private showPrevButton(): void {
    this._renderer.setStyle(this.leftNav, 'visibility', 'visible');
  }

  private hideNextButton(): void {
    this._renderer.setStyle(this.rightNav, 'visibility', 'hidden');
  }

  private showNextButton(): void {
    this._renderer.setStyle(this.rightNav, 'visibility', 'visible');
  }

  private isFirstPage(page: number): boolean {
    return page == 0;
  }

  private isLastPage(page: number): boolean {
    return this.pages == page;
  }

  handleServiceCardClick(data: any): void {
    this.onServiceCardClick.emit(data);
  }
}
