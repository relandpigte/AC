import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[autofocus]',
})
export class AutofocusDirective implements AfterViewInit {

  private _isAutofocus = false;

  constructor(private _element: ElementRef) { }

  @Input() set autofocus(isAutofocus: boolean) {
    this._isAutofocus = isAutofocus;
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && this._isAutofocus) this._element.nativeElement.focus();
    });
    observer.observe(this._element.nativeElement);
  }
}
