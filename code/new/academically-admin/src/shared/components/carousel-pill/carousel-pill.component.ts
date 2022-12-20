import { Component, EventEmitter, Injector, Input, Output, OnChanges, SimpleChanges, ElementRef, ViewChild, OnDestroy, AfterViewInit, HostListener } from "@angular/core";
import { AppComponentBase } from '@shared/app-component-base';
import { Utils } from "@shared/helpers/utils";
import KeenSlider, { KeenSliderInstance } from 'keen-slider';

import * as _ from 'lodash';

@Component({
    selector: 'app-carousel-pill',
    templateUrl: './carousel-pill.component.html',
    styleUrls: ['./carousel-pill.component.less']
})
export class CarouselPillComponent extends AppComponentBase implements AfterViewInit, OnChanges, OnDestroy {

    @ViewChild("carouselContainer") carouselContainer: ElementRef<HTMLElement>;
    carouselInstance: KeenSliderInstance = null;
    currentItem: number = 0;

    @Input() choices: any[];
    @Input() key: string;

    @Input() showAll: boolean = true;
    @Input() canAdd: boolean = true;

    @Input() itemSpacing: number = 10;

    @Output() onSelect = new EventEmitter<string[]>();
    @Output() onAdd =  new EventEmitter<void>();

    windowResizeInterval$: any;
    private selected: string[] = [];

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    get isLastItem(): boolean { return this.carouselInstance.track.details.maxIdx === 0 || this.currentItem === this.carouselInstance.track.details.maxIdx}
    isAboveProgress(progress: number): boolean { return this.carouselInstance.track.details.progress >= progress; }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.choices?.previousValue !== changes.choices?.currentValue && this.choices?.length) {
            this.initCarousel();
        }

        if ('choices' in changes && !_.isEqual(changes.choices.previousValue, changes.choices.currentValue)) {
            this.handleSelectAll();
        }
    }

    ngAfterViewInit(): void {
        this.initCarousel();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        if (this.carouselInstance) this.carouselInstance.destroy()
    }

    @HostListener('window:resize')
    onWindowResize() {
        this.initCarousel();
    }

    private initCarousel(): void {
      if (this.windowResizeInterval$) clearTimeout(this.windowResizeInterval$);
      this.windowResizeInterval$ = setTimeout(() => {
        if (this.carouselInstance) this.carouselInstance.destroy();
        this.carouselInstance = new KeenSlider(this.carouselContainer.nativeElement, {
          initial: this.currentItem,
          loop: false,
          mode: 'free-snap',
          slides: {
            perView: 'auto',
            spacing: this.itemSpacing,
          }
        },
        [
          slider => {
            Utils.wheelController(slider);

            slider.on('slideChanged', (s) => {
              this.currentItem = s.track.details.rel;
            });
          }
        ]);
      });
    }

    isPillSelected(i: string): boolean { return this.selected.includes(i); }
    isAllPillSelected(): boolean { return !this.selected.length; }
    getDisplayValue(choice: any): string { return this.key ? _.get(choice, this.key) : choice; }

    handleAddPill(): void {
        this.onAdd.emit();
    }

    handleSelectAll(): void {
        this.selected = [];
        this.onSelect.emit(this.choices);
    }

    handleSelectPill(i: string): void {
        if (this.selected.includes(i)) this.selected = _.remove(this.selected, x => x != i);
        else this.selected.push(i);
        this.selected = _.uniq(this.selected);
        this.onSelect.emit(this.selected.length ? this.selected : this.choices);
    }
}
