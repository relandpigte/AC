import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Injector, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Utils } from '@shared/helpers/utils';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import * as _ from 'lodash';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel-wrapper.component.html',
  styleUrls: ['./carousel-wrapper.component.scss']
})
export class CarouselWrapperComponent extends AppComponentBase implements AfterViewInit, OnChanges, OnDestroy {

  @ViewChild("carouselContainer") carouselContainer: ElementRef<HTMLElement>;
  carouselInstance: KeenSliderInstance = null;
  currentItem: number = 0;

  private MIN_ITEMS = 3;

  @Input() items: any[] = [];
  @Input() maxItems: number = 0;
  @Input() visibleItems: number;
  @Input() itemWidth: number = 0;
  @Input() itemSpacing: number = 15;

  @Input() templateRef: any;
  @Input() metadata: any;

  @Input() isAutoFit: boolean = false;
  @Input() isCircular: boolean = false;
  @Input() isInfiteScroll: boolean = false;
  @Input() isFeatured: boolean = false;
  @Input() isLoading: boolean = false;

  @Output() onRequestNewData: EventEmitter<any> = new EventEmitter();
  @Output() onServiceCardShareClick: EventEmitter<any> = new EventEmitter();
  @Output() onServiceCardClick: EventEmitter<any> = new EventEmitter();

  allowLoader = true;
  perView: number;
  windowResizeInterval$: any;

  constructor(
    injector: Injector,
    private _elRef : ElementRef
    ) {
    super(injector);
  }

  get isLastItem(): boolean { return this.carouselInstance.track.details.maxIdx === 0 || this.currentItem === this.carouselInstance.track.details.maxIdx}
  isAboveProgress(progress: number): boolean { return this.carouselInstance.track.details.progress >= progress; }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes.items?.previousValue !== changes.items?.currentValue && this.items?.length) {
        if (this.items.length < this.MIN_ITEMS) {
          this.items.push(Array(this.MIN_ITEMS - this.items.length).fill({}));
        }
        this.computeItemsPerView(false);
      }
  }

  ngAfterViewInit(): void {
    this.computeItemsPerView();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.carouselInstance) this.carouselInstance.destroy()
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.computeItemsPerView();
  }

  private computeItemsPerView(allowLoader: boolean = true): void {
    if (this.windowResizeInterval$) clearTimeout(this.windowResizeInterval$);
    this.windowResizeInterval$ = setTimeout(() => {
      if (this.visibleItems) {
        this.perView = this.visibleItems;
      } else {
        const item = this._elRef.nativeElement.querySelector('.service-card') ?? this._elRef.nativeElement.querySelector('.topic') ??
          this._elRef.nativeElement.querySelector('.cluster') ;
        if (!item) {
          this.computeItemsPerView();
          return;
        }
        const containerWidth = this._elRef.nativeElement.getBoundingClientRect().width;
        const contentItemWidth = item.getBoundingClientRect().width;
        this.perView = Math.floor(containerWidth / contentItemWidth);
      }

      if (this.carouselInstance) this.carouselInstance.destroy();
      this.carouselInstance = new KeenSlider(this.carouselContainer.nativeElement, {
        initial: this.currentItem,
        loop: this.isCircular,
        mode: 'free-snap',
        slides: {
          perView: this.isAutoFit ? 'auto' : this.perView ?? 3,
          spacing: this.itemSpacing,
        }
      },
      [
        slider => {
          Utils.wheelController(slider);

          slider.on('slideChanged', (s) => {
            this.currentItem = s.track.details.rel;
          });

          slider.on('animationEnded', () => {
            this.allowLoader = allowLoader;
            this.handleInfiniteScroll();
          });
        }
      ]);
    });
  }

  handleInfiniteScroll(): void {
    if (this.isInfiteScroll == true) {
      if (this.isAboveProgress(0.8)) {
        if (this.items?.length < this.maxItems) {
          this.onRequestNewData.emit(this.items?.length);
        }
      }
    }
  }

  handleServiceCardShareClick(data: any): void {
    this.onServiceCardShareClick.emit(data);
  }

  handleServiceCardClick(data: any): void {
    this.onServiceCardClick.emit(data);
  }
}
