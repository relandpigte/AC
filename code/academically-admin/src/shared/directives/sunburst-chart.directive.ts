import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import Sunburst, { Node, SunburstChartInstance } from 'sunburst-chart';
import * as d3 from 'd3';

@Directive({
  selector: '[sunburtChart]'
})
export class SunburstChartDirective {
  @Input() rootNodeLabel = 'root';
  @Output() nodeClick = new EventEmitter<any>();
  @Output() nodeSelectClick = new EventEmitter<any>();

  private _chart: SunburstChartInstance;
  private _data: any[];
  private _typingTimer: NodeJS.Timeout;
  private _chartColors = {
    '6ba6d8df-c40c-425a-b1d3-993a9adbe043': ['#6D2CAD', '#8236CD', '#9A5FD7'],
    'b178e0da-6b46-4594-bde3-653d4628e8f8': ['#9E061E', '#BD0924', '#E1092C'],
    'fa92fc51-f588-4bee-b7d3-3fc4c7f4cb99': ['#1A51B7', '#1F62DB', '#457FE4'],
    '988af116-b964-4563-88c6-20827a24a484': ['#115161', '#156174', '#1B7389'],
    'b3a85984-da72-47b4-9019-facf6f236b85': ['#2A6AAD', '#367ECD', '#5E98D7'],
    '2d70aab7-c2e1-494a-a58d-63b322592738': ['#BA310D', '#E03C0F', '#E03C0F'],
    'e05d2ce7-1724-42ab-aa28-f4fb85ba4a30': ['#11760D', '#138D0D', '#16AA11'],
    'c40fe45e-e5c2-46ec-b062-7dbdd31f2db5': ['#992B81', '#B7339A', '#CD4DB0'],
    'c2d5e455-b3ed-4b38-a1a1-c43a998da61f': ['#876202', '#A17700', '#C18E03'],
    '56e9e6fc-371c-4921-9474-886a4f8b84d0': ['#97400E', '#B54C0F', '#B54C0F']
  };

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
    data.forEach(d => {
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
    data.forEach(d => {
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
      children: data
    };
    return rootNode;
  }

  private initializeChart(): void {
    const self = this;
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
        return self.getColor(parent);
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
            setTimeout(function() {
              if (clickCount === 1) {
                self._chart.focusOnNode(node);
                self.nodeClick.emit(node);
              } else {
                if (node.id) {
                  self.nodeSelectClick.emit(node);
                }
              }
              clickCount = 0;
            }, 300);
          }
        }
      })(self._el.nativeElement);
  }

  private getColor(node: any): string {
    if (node.parentIdMap) {
      const parentIdMaps = node.parentIdMap.split('.');
      const colorIndex = parentIdMaps.length - 1;
      const rootId = parentIdMaps[0];
      const chartColor = this._chartColors[rootId];
      if (chartColor) {
        const colorShade = chartColor[colorIndex];
        if (colorShade) {
          return colorShade;
        }
      }
    }
    return d3.scaleOrdinal(d3.schemePaired)();
  }
}
