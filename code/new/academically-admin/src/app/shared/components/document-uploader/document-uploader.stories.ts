// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { DragClassUpdaterDirective } from '../../../../shared/directives/drag-class-updater.directive';
import { DocumentUploaderComponent } from './document-uploader.component';

export default {
  title: 'Components/Document Uploader',
  component: DocumentUploaderComponent,
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
} as Meta;

const template: Story<DocumentUploaderComponent> = (args: DocumentUploaderComponent) => ({
  moduleMetadata: {
    declarations: [
      DragClassUpdaterDirective,
    ],
  },
  component: DocumentUploaderComponent,
  props: args,
});

export const initial = template.bind({});
initial.args = {

};
