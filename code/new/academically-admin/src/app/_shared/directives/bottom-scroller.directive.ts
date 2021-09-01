import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[bottomScroller]'
})
export class BottomScrollerDirective {

  constructor(private _el: ElementRef) { }

  @Input() set bottomScroller(variable: any) {
    setTimeout(() => {
      const div = this._el.nativeElement as HTMLDivElement;
      div.scrollTop = div.scrollHeight;
    });
  }

}
