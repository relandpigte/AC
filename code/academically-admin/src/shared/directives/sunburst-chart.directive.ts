import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import Sunburst, { Node, SunburstChartInstance } from 'sunburst-chart';
import * as d3 from 'd3';

@Directive({
  selector: '[sunburtChart]',
})
export class SunburstChartDirective {
  @Input() rootNodeLabel = 'root';
  @Output() nodeClick = new EventEmitter<any>();

  private _chart: SunburstChartInstance;
  private _data: any[];
  private _typingTimer: NodeJS.Timeout;

  constructor(private _el: ElementRef) {}

  @Input() set chartData(data: any[]) {
    if (data && data.length > 0) {
      this._data = data;
      this.initializeChart();
    }
  }

  @Input() set searchKeyword(searchKeyword: string) {
    clearTimeout(this._typingTimer);
    this._typingTimer = setTimeout(() => {
      this.searchData(searchKeyword);
    }, 500);
  }

  private searchData(searchKeyword: string): void {
    if (this._data) {
      let rootNode: Node;
      if (searchKeyword) {
        const ids = this.getNodeIdsByKeyword(this._data, searchKeyword);
        const searchedData = this.getNodsFromIds([...this._data], ids);
        rootNode = this.getRootNode(searchedData);
      } else {
        rootNode = this.getRootNode(this._data);
      }
      this._chart.data(rootNode).focusOnNode(rootNode);
    }
  }

  private getNodsFromIds(data: any[], ids: string[]): any[] {
    const results: any[] = [];
    data.forEach((d) => {
      if (ids.includes(d.id)) {
        const result = Object.assign({}, d);
        result.children = this.getNodsFromIds([...d.children], ids);
        results.push(result);
      }
    });
    return results;
  }

  private getNodeIdsByKeyword(data: any[], searchKeyword: string): string[] {
    const filteredIds: string[] = [];
    data.forEach((d) => {
      if (d.name.toLowerCase().indexOf(searchKeyword.toLowerCase()) > -1) {
        const ids = d.parentIdMap.split('.');
        filteredIds.push(...ids);
      }
      if (d.children && d.children.length > 0) {
        const childIds = this.getNodeIdsByKeyword(d.children, searchKeyword);
        filteredIds.push(...childIds);
      }
    });
    return Array.from(new Set(filteredIds));
  }

  private getRootNode(data: any[]): Node {
    const self = this;
    const rootNode: Node = {
      name: self.rootNodeLabel,
      children: data,
    };
    return rootNode;
  }

  private initializeChart(): void {
    const self = this;
    const color = d3.scaleOrdinal(d3.schemePaired);
    const rootNode = this.getRootNode(self._data);
    let clickCount = 0;
    self._chart = Sunburst()
      .centerRadius(0.1)
      .radiusScaleExponent(1)
      .data(rootNode)
      .label('name')
      .size('size')
      .width(self._el.nativeElement.clientWidth)
      .height(self._el.nativeElement.clientHeight)
      .color((parent: any) => {
        return color(parent ? parent.id : null);
      })
      .tooltipTitle((d, node) => {
        return `<b>${node.data.name}</b>`;
      })
      .tooltipContent((d, node) => {
        let instructions = '';
        if (node.value !== 1) {
          instructions = `<i>*Click to expand.</i><br>`;
        }
        if (node.id) {
          instructions = instructions + `<i>*Double click to select.</i><br>`;
        }
        return instructions;
      })
      .onClick((node: any) => {
        if (node) {
          clickCount++;
          if (clickCount === 1) {
            setTimeout(function () {
              if (clickCount === 1) {
                self._chart.focusOnNode(node);
              } else {
                if (node.id) {
                  self.nodeClick.emit(node);
                }
              }
              clickCount = 0;
            }, 300);
          }
        }
      })(self._el.nativeElement);
  }
}
