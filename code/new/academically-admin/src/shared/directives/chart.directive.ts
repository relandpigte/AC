import { Directive, ElementRef, Input } from '@angular/core';

declare var Chart: any;

@Directive({
  selector: '[chart]',
})
export class ChartDirective {
  private chart: any;
  constructor(private _el: ElementRef) { }

  @Input() set chartSettings(settings: any) {
    if (this.chart) {
      this.chart.destroy();
      console.log('destroyed');
    }
    this.chart = new Chart(this._el.nativeElement, settings);
  }

  @Input() set chartDataset(dataset: any) {
    setTimeout(() => {
      this.chart.data.datasets = dataset;
      this.chart.update();
    });
  }
}
