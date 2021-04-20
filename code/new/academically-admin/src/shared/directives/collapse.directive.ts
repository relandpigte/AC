import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[collapse]'
})
export class CollapseDirective implements AfterViewInit {
  @Input() collapse = false;
  private _expandIconTemplate = '<i class="fe fe-chevron-down"></i>';
  private _collapseIconTemplate = '<i class="fe fe-chevron-up"></i>';

  constructor(private _el: ElementRef) {
  }

  ngAfterViewInit(): void {
    const container = this._el.nativeElement as HTMLDivElement;
    const collapseButton = container.getElementsByClassName('collapse-button')[0] as HTMLButtonElement;
    const collapseContent = container.getElementsByClassName('collapse-content')[0] as HTMLDivElement;
    collapseContent.style.overflow = 'hidden';
    collapseContent.style.transition = 'all 200ms ease-in';
    const height = collapseContent.getBoundingClientRect().height;
    collapseButton.innerHTML = this.collapse ? this._expandIconTemplate : this._collapseIconTemplate;
    collapseContent.style.height = `${this.collapse ? 0 : collapseContent.getBoundingClientRect().height}px`;
    collapseButton.addEventListener('click', () => {
      if (this.collapse) {
        collapseButton.innerHTML = this._collapseIconTemplate;
        collapseContent.style.height = `${height}px`;
      } else {
        collapseButton.innerHTML = this._expandIconTemplate;
        collapseContent.style.height = '0px';
      }
      this.collapse = !this.collapse;
    });
  }
}
