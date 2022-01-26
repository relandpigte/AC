import { Content } from './content';
import { MarginType } from './margin-type';

export class ComponentContent extends Content {
  icon: string;
  description: string;
  backgroundColor: string;
  marginType: number;
  marginTop: number;
  marginBottom: number;
  width: number;
  disableMargins: boolean;

  private normalMargin = 40;
  private narrowMargin = 20;
  private moderateMargin = 60;
  private wideMargin = 100;

  private normalWidth = 900;
  private narrowWidth = 800;
  private moderateWidth = 1000;
  private widgeWidth = 1100;

  constructor() {
    super();
    this.marginType = MarginType.Normal;
    this.backgroundColor = '#FFFFFF';
    this.setMargins();
  }

  get margin(): string {
    if (!this.marginTop && !this.marginBottom) {
      return '0';
    }

    return `${this.marginTop}px 0 `
      + `${this.marginBottom}px 0`;
  }

  public setMargins(): void {
    switch (this.marginType) {
      case MarginType.None:
        this.marginTop = 0;
        this.marginBottom = 0;
        this.width = this.normalWidth;
        break;
      case MarginType.Normal:
        this.marginTop = this.normalMargin;
        this.marginBottom = this.normalMargin;
        this.width = this.normalWidth;
        break;
      case MarginType.Narrow:
        this.marginTop = this.narrowMargin;
        this.marginBottom = this.narrowMargin;
        this.width = this.narrowWidth;
        break;
      case MarginType.Moderate:
        this.marginTop = this.moderateMargin;
        this.marginBottom = this.moderateMargin;
        this.width = this.moderateWidth;
        break;
      case MarginType.Wide:
        this.marginTop = this.wideMargin;
        this.marginBottom = this.wideMargin;
        this.width = this.widgeWidth;
        break;
    }
  }
}
