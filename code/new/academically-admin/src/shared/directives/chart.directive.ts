import { Directive, ElementRef, Input } from '@angular/core';

declare var Chart: any;

@Directive({
  selector: '[chart]',
})
export class ChartDirective {
  constructor(private _el: ElementRef) { }
  chart: any;

  @Input() set chartSettings(settings: any) {
    this.chart = new Chart(this._el.nativeElement, settings);
  }

  @Input() set chartDataset(dataset: any) {
    setTimeout(() => {
      this.chart.data.datasets = dataset;
      this.chart.update();
    });
  }
}
