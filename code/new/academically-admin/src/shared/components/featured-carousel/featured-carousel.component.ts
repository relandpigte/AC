import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-featured-carousel',
  templateUrl: './featured-carousel.component.html',
  styleUrls: ['./featured-carousel.component.scss']
})
export class FeaturedCarouselComponent implements OnInit {
  @Input() items: any[] = [];
  @Input() isLoading: boolean = true;
  @Input() visibleItems: number = 3;

  page: number = 0;
  pages: number = 0;

  constructor() { }

  ngOnInit() {
    this.pages = this.items.length - this.visibleItems;
  }

  isItemInPage(index: number): boolean {

    let start: number = 0;
    let end: number = this.visibleItems - 1;

    if (this.page > 0) {
      start = this.page;
      end = this.page + (this.visibleItems -1);
    }

    return index >= start && index <= end;
  }

  onPrevClick(): void {
    if (this.page > 0) {
      this.page--;
    }
    // else {
    //   this.page = this.pages
    // }
  }

  onNextClick(): void {
    if (this.page < this.pages) {
      this.page++;
    }
    // else {
    //   this.page = 0
    // }
  }

  isFirstPage(): boolean {
    return this.page <= 0;
  }

  isLastPage(): boolean {
    return this.page >= this.pages
  }
}
