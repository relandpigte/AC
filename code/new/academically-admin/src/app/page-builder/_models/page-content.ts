import { MarginType } from './margin-type';
import { PageSection } from './page-section';

export class PageContent {
  name: string;
  marginType: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;

  private normalMargin = 40;
  private narrowMargin = 20;
  private moderateMargin = 60;
  private wideMargnin = 100;

  constructor(
    marginType?: number,
    marginTop?: number,
    marginBottom?: number,
    marginLeft?: number,
    marginRight?: number,
  ) {
    this.marginType = marginType || MarginType.Normal;
    this.marginTop = marginTop;
    this.marginBottom = marginBottom;
    this.marginLeft = marginLeft;
    this.marginRight = marginRight;
  }

  public setMargins(): void {
    switch (this.marginType) {
      case MarginType.None:
        this.marginTop = 0;
        this.marginBottom = 0;
        this.marginLeft = 0;
        this.marginRight = 0;
        break;
      case MarginType.Normal:
        this.marginTop = this.normalMargin;
        this.marginBottom = this.normalMargin;
        this.marginLeft = this.normalMargin;
        this.marginRight = this.normalMargin;
        break;
      case MarginType.Narrow:
        this.marginTop = this.narrowMargin;
        this.marginBottom = this.narrowMargin;
        this.marginLeft = this.narrowMargin;
        this.marginRight = this.narrowMargin;
        break;
      case MarginType.Moderate:
        this.marginTop = this.moderateMargin;
        this.marginBottom = this.moderateMargin;
        this.marginLeft = this.moderateMargin;
        this.marginRight = this.moderateMargin;
        break;
      case MarginType.Wide:
        this.marginTop = this.wideMargnin;
        this.marginBottom = this.wideMargnin;
        this.marginLeft = this.wideMargnin;
        this.marginRight = this.wideMargnin;
        break;
    }
  }
}
