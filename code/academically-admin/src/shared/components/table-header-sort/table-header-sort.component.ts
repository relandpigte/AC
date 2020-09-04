import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export class TableHeaderSortData {
  title: string;
  sortColumn?: string;
  colspan?: number;
}

@Component({
  selector: '[table-header-sort]',
  templateUrl: './table-header-sort.component.html',
  styleUrls: ['./table-header-sort.component.less']
})
export class TableHeaderSortComponent implements OnInit {
  @Output() sortChange: EventEmitter<string> = new EventEmitter();
  @Input() headers: TableHeaderSortData[] = [];
  sortOrder = 'asc';
  sortColumn = '';

  constructor() { }

  ngOnInit(): void {
    if (this.headers.length > 0) {
      this.sortColumn = this.headers[0].sortColumn;
    }
  }

  public onSortOrderChange(sortColumn: string): void {
    if (this.sortOrder === 'desc' || (this.sortOrder === 'asc' && this.sortColumn !== sortColumn)) {
      this.sortOrder = 'asc';
    } else {
      this.sortOrder = 'desc';
    }
    this.sortColumn = sortColumn;
    const sorting = `${sortColumn} ${this.sortOrder}`;
    this.sortChange.emit(sorting);
  }
}
