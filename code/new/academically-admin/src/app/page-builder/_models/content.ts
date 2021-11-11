import { MarginType } from './margin-type';

export abstract class Content {
  name: string;
  backgroundColor: string;
  marginType: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  disableMargins: boolean;

  private normalMargin = 40;
  private narrowMargin = 20;
  private moderateMargin = 60;
  private wideMargnin = 100;

  constructor() {
    this.marginType = MarginType.None;
    this.backgroundColor = '#FFFFFF';
    this.setMargins();
  }

  get margin(): string {
    if (!this.marginTop && !this.marginBottom && !this.marginLeft && !this.marginRight) {
      return '0';
    }

    return `${this.marginTop}px ${this.marginRight}px `
      + `${this.marginBottom}px ${this.marginLeft}px`;
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
