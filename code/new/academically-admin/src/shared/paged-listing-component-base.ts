import { AppComponentBase } from 'shared/app-component-base';
import { Component, Injector, OnInit } from '@angular/core';

export class PagedResultDto {
  items: any[];
  totalCount: number;
}

export class EntityDto {
  id: number;
}

export class PagedAndSortedRequestDto {
  skipCount: number;
  maxResultCount: number;
  sort: string;
}

@Component({
  template: '',
})
export abstract class PagedListingComponentBase<TEntityDto> extends AppComponentBase implements OnInit {

  public pageSize = 10;
  public pageNumber = 1;
  public totalPages = 1;
  public totalItems: number;
  public isTableLoading = false;
  public pageSizeSelections = [5, 10, 20, 50];
  public sorting = '';

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.getDataPage(this.pageNumber);
  }

  public showPaging(result: PagedResultDto, pageNumber: number): void {
    this.totalPages = ((result.totalCount - (result.totalCount % this.pageSize)) / this.pageSize) + 1;

    this.totalItems = result.totalCount;
    this.pageNumber = pageNumber;
  }

  public getDataPage(page: number): void {
    const req = new PagedAndSortedRequestDto();
    req.maxResultCount = this.pageSize;
    req.skipCount = (page - 1) * this.pageSize;
    req.sort = this.sorting;

    this.isTableLoading = true;
    this.list(req, page, () => {
      this.isTableLoading = false;
    });
  }

  public pageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.getDataPage(1);
  }

  public sortChange(sorting: string): void {
    this.sorting = sorting;
    this.getDataPage(this.pageNumber);
  }

  protected abstract list(request: PagedAndSortedRequestDto, pageNumber: number, finishedCallback: Function): void;
}
