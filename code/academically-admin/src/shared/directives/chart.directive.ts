import { Directive, ElementRef, Input } from '@angular/core';

declare var Chart;

@Directive({
  selector: '[chart]',
})
export class ChartDirective {
  constructor(private _el: ElementRef) {}

  @Input() set chartSettings(settings: any) {
    const chart = new Chart(this._el.nativeElement, settings);
  }
}
