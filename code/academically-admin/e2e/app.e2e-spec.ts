import { AcademicallyTemplatePage } from './app.po';

describe('Academically App', function() {
  let page: AcademicallyTemplatePage;

  beforeEach(() => {
    page = new AcademicallyTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
