import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[fixedHeight]'
})
export class FixedHeightDirective implements AfterViewInit {

  constructor(private _el: ElementRef) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const div = this._el.nativeElement as HTMLDivElement;
      div.style.height = `${div.clientHeight}px`;
    }, 500);
  }

}
